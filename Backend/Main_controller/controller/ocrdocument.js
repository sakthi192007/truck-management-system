const express = require("express");
const router = express.Router();

const fs = require("fs/promises");
const fsSync = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { Mistral } = require("@mistralai/mistralai");

dotenv.config();

/* ===================== ENV ===================== */
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
if (!MISTRAL_API_KEY) {
  throw new Error("MISTRAL_API_KEY missing");
}

const client = new Mistral({ apiKey: MISTRAL_API_KEY });

/* ===================== DIRECTORIES ===================== */
const UPLOAD_DIR = path.join(__dirname, "../../uploads");
const OUTPUT_DIR = path.join(__dirname, "../../output");
const TABLE_OUTPUT_DIR = path.join(__dirname, "../../table_output");

async function ensureDirs() {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(TABLE_OUTPUT_DIR, { recursive: true });
}
ensureDirs();

// -------------------- FIXED PROMPT --------------------
const EXTRACTION_PROMPT = `
You are an intelligent document information extraction engine for
shipping and logistics documents (Delivery Order, Bill of Lading,
Invoice, etc).

Your task is to extract structured data from the DOCUMENT TEXT
and return a VALID JSON OBJECT that STRICTLY follows the FIXED JSON
SCHEMA below.

==================================================
ABSOLUTE OVERRIDE RULES (HIGHEST PRIORITY)
==================================================

1. You are STRICTLY FORBIDDEN from generating new text.
2. Every extracted value MUST exist verbatim in the document.
3. You MUST NOT concatenate labels + values.
4. You MUST NOT infer from position, proximity, or meaning.
5. If a rule is violated → RETURN null for that field.
6. When unsure → RETURN null.
7. Follow schema structure and key order EXACTLY.

----------------------------------
FIXED JSON SCHEMA (DO NOT MODIFY)
----------------------------------

{
  "shipper": {
    "name": null,
    "contact_person_name": null,
    "phone_number": null
  },
  "consignee": {
    "name": null,
    "contact_person_name": null,
    "phone_number": null
  },
  "booking_details": {
    "booking_number": null,
    "placement_date": null,
    "pickup_date": null
  },
  "location_details": {
    "place_of_clearance": null,
    "place_of_pickup": null
  },
  "customs": {
    "customs_clearance_date": null
  },
  "commodity": null,
  "port_details": {
    "port_cut_off": null,
    "etd": null,
    "eta": null
  },
  "shipping_details": {
    "shipping_line": null,
    "vessel_name": null,
    "voyage": null
  },
  "delivery_order": {
    "do_issue_date": null,
    "do_valid_upto": null
  },
  "container_details": {
    "container_number": null,
    "container_type": null,
    "seal_number": null
  },
  "cargo_details": {
    "number_of_packages": null,
    "cargo_weight": {
      "value": null,
      "weight_type": null
    }
  }
}

----------------------------------
ENTITY CONSISTENCY
----------------------------------

• If consignee.name is populated → ALL shipper fields MUST be null.
• If shipper.name is populated → ALL consignee fields MUST be null.

----------------------------------
FIELD EXTRACTION RULES
----------------------------------

### SHIPPER
Extract ONLY from lines that are explicitly labeled exactly as:
"SHIPPER" or "Shipper".

ABSOLUTE PROHIBITIONS (HIGHEST PRIORITY):

• UNDER NO CIRCUMSTANCES treat the document HEADER
  (top-most company name, logo text, or letterhead)
  as the shipper.

• UNDER NO CIRCUMSTANCES extract a shipper from an
  UNLABELED company block, address block, depot details,
  operational contact section, or signature block.

• If a company name appears WITHOUT a clear
  "SHIPPER" or "Shipper" label → RETURN null.

• UNDER NO CIRCUMSTANCES treat:
  "Booking Party", "Bkg Party", "Bkg.Party",
  "Booking Client", "Customer", "Agent",
  "Depot", "Depot Incharge", or any booking-related party
  as the shipper — EVEN IF it contains a legal entity name.

RULES:

• If NONE of the valid labels ("SHIPPER", "Shipper") exist → RETURN null.
• Extract ONLY the legal company name immediately following the label.
• STOP extraction immediately before any address indicator.
• If company name and address appear as a single block → extract ONLY the company name.
• If company name cannot be isolated unambiguously → RETURN null.
• Do NOT extract from header, footer, or signature.
• If the extracted value is a city, port, country, or geographic location → RETURN null.
• A valid shipper name MUST contain a legal entity indicator
  (PVT, PRIVATE, LIMITED, LTD, LLP, INC, GMBH, CO).
• If no legal entity indicator is present → RETURN null.
• Phone number MUST be extracted ONLY if explicitly labeled under SHIPPER.

----------------------------------

### CONSIGNEE
Extract ONLY from:
"PLEASE DELIVER TO", "DELIVER TO", "CONSIGNEE", "Received from", "RECEIVED FROM"

• If NONE of the above labels exist → RETURN null.
• Extract ONLY the legal company name.
• STOP extraction immediately before any address indicator.
• If company name and address appear as a single block → extract ONLY the company name.
• If company name cannot be isolated unambiguously → RETURN null.
• Do NOT extract from document header or signature footer.
• "Booking Party" MUST NEVER be treated as consignee.
• If the extracted name appears under or near:
  "Booking Party", "Bkg Party", "Bkg.Party" → RETURN null.
• Do NOT infer consignee from booking confirmation, shipping order,
  booking party, agent, or customer names.
• If consignee is not explicitly labeled → RETURN null.
• Phone number MUST be extracted ONLY if explicitly labeled.

----------------------------------

### BOOKING NUMBER
Extract ONLY from:
"Booking No", "BOOKING NO", "Booking Number"," BOOKING NUMBER","B/L NO", "BL NO", "B L NO", "B/L NUMBER", "BL NUMBER",

• Value MAY be alphanumeric and include hyphens
• Do NOT extract from: "DO NO", "D/O NO", "DO No".

----------------------------------

### PLACEMENT DATE
• placement_date MUST ALWAYS be returned as null.

----------------------------------

### PICKUP DATE
• pickup_date MUST ALWAYS be returned as null.

----------------------------------

### PLACE OF CLEARANCE
• place_of_clearance MUST be returned as null.

----------------------------------

### PLACE OF PICKUP
• Extract ONLY from:
"Pickup From", "PICKUP FROM", "Pickup from"

----------------------------------

### Customs Clearance Date
• customs_clearance_date MUST be returned as null.

----------------------------------

### COMMODITY (FULL DESCRIPTION ONLY)

• Extract commodity ONLY IF one of the following labels exists verbatim:
  "Description", "Description of Goods", "DESCRIPTION",
  "Marks Description of Goods", "Commodity"

• If NONE of the above labels exist → RETURN null.

• Extract ONLY the commercial description of goods.
• ALLOW HS Codes ONLY if they appear inside the description block.

• STRICTLY EXCLUDE:
  – Container quantity or size (e.g., "4 X 40HQ", "Dry-40'HQ", "20GP")
  – Equipment type, container type, or container count
  – Delivery instructions (e.g., "PLEASE DELIVER", "PLEASE DELIVER :")
  – Cargo type labels (e.g., "GENERAL")

• Do NOT include text containing:
  "GST", "GSTIN", "GST NO", "PAN", "IEC", "TAX", "VAT", "CIN"

• If container-related text appears under delivery instructions or outside a description block
  → RETURN null.

• Return the commodity as a SINGLE continuous string without line breaks.

----------------------------------

### PORT CUT-OFF

Extract ONLY if ONE of the following labels exists verbatim:
"Port Cut-Off", "PORT CUT-OFF", "Loading Cut-Off",
"Terminal Cut-Off", "Port Cargo Cut-Off".

• Consider ONLY the above labels for extraction.

• UNDER NO CIRCUMSTANCES extract Port Cut-Off from:
  "INTENDED CY CUT-OFF", "INTENDED SI/eSI CUT-OFF", "INTENDED VGM CUT-OFF",
  "DOC CUT-OFF", "VGM CUT-OFF", "CUSTOMS CUT-OFF",
  "SHIPPING INSTRUCTIONS CUT-OFF", "HAZ/IMO CUT-OFF",
  "VERIFIED GROSS MASS CONFIRMATION (SOLAS) CUT-OFF",
  "SPECIAL CUT-OFF (SHIPPING BILL CUT-OFF)", "SI CUT-OFF",
  "DPE CUT-OFF", "FCL DELIVERY CUT-OFF", "RAMP CUT-OFF"
  — EVEN IF a date is present.

• Returned value MUST be converted to format: DD/MM/YYYY.
• If conversion is not possible → RETURN null.
• If NONE of the allowed labels exist verbatim → RETURN null.

----------------------------------

### ETA

• Extract ETA ONLY if the label "ETA" exists verbatim AND a date appears on the SAME LINE.
• Ignore ETA labels without a date.
• Consider ONLY the FIRST valid ETA in strict top-to-bottom reading order.
• Returned value MUST be converted to DD/MM/YYYY.
• If no valid ETA exists → RETURN null.

----------------------------------

### ETD

• Extract ETD ONLY if the label "ETD" exists verbatim AND a date appears on the SAME LINE.
• Ignore ETD labels without a date.
• Consider ONLY the FIRST valid ETD in strict top-to-bottom reading order.
• Returned value MUST be converted to DD/MM/YYYY.
• If no valid ETD exists → RETURN null.

----------------------------------

### SHIPPING LINE
• Extract ONLY from the document HEADER (top-most company name)
• The header MUST represent a vessel-operating carrier
• Freight forwarders, agents, terminals, CHA names are INVALID
• If carrier is not unambiguously identifiable in header → RETURN null

----------------------------------

### VESSEL NAME
Extract ONLY from:
"VESSEL NAME", "VESSEL", "VSL", "vsl", "Vsl", "Loading Vessel", "Intended Vessel"

• If multiple vessel values exist → extract ONLY the FIRST vessel.
• If vessel and voyage appear together → split correctly and extract vessel name only.

----------------------------------

### VOYAGE
Extract ONLY from:
"VOYAGE NUMBER", "VOYAGE NO", "VOY NO", "Voy No", "VOY"

• If multiple voyage values exist → extract ONLY the FIRST voyage.
• If vessel and voyage appear together → split correctly and extract voyage only.

----------------------------------

### DELIVERY ORDER – ISSUE DATE
• Extract ONLY from:
  "DO Issue Date", "DO ISSUE DATE", "Issue Date", "DATE OF ISSUE", "Invoice Issue Date", "Confirmed Date",
• Returned value MUST be converted to format: DD/MM/YYYY
• If conversion is not possible → RETURN null

----------------------------------

### DELIVERY ORDER – VALID DATE
Extract ONLY from:
"D/O VALID TILL", "DO VALID TILL", "VALID UPTO", "Valid upto", "Validity", "Due Date", "Invoice Due Date", "Booking Validity Date",

• Convert to DD/MM/YYYY

----------------------------------

### CONTAINER NUMBER
Extract ONLY from labels:
"Container No", "CONTAINER NO", "Ctnr.No", "CTNR NO","CONT.NO .",

• Must match format: 4 uppercase letters + 7 digits

----------------------------------

### CONTAINER TYPE
• Extract ONLY ISO Size & Type Codes explicitly present in the document.
  Examples: 20GP, 20DC, 40HC, 45GP.
• Numeric values alone (e.g., "20", "40") are INVALID.
• Values appearing under table columns such as "SIZE", "SZ", or "CNTR SIZE" MUST be ignored.
• Do NOT infer container type from container number, size, status, or weight.
• If a valid ISO Size & Type Code does not exist verbatim → RETURN null.
• If the extracted value contains ONLY digits → FORCE null.

----------------------------------

### SEAL NUMBER
Extract ONLY from:
"Seal No", "Seal Number", "Seal Code", "SEAL NO","SEAL NO.","Seal Code.",

• If label is explicitly present (even inside a table) → ALLOW extraction

----------------------------------

### NUMBER OF PACKAGES
• Extract ONLY if label is exactly:
  "PACKAGES", "PACKAGE", "PKGS", "PKG"
• Extract ONLY the numeric value
• If unit text (PALLETS, CARTONS, BOXES, etc.) is present → REMOVE it
• If numeric-only value cannot be isolated → RETURN null

----------------------------------

### CARGO WEIGHT VALUE
Extract ONLY if label is exactly:
"GROSS WEIGHT", "GROSS WT", "GROSS WGT", "Gr wt",
"Gross Weight", "gross weight", "GR.WT .",
"Cargo Weight", "Container Weight", "Estimated Weight" " Gross Wt. Container"

----------------------------------

### CARGO WEIGHT TYPE
Extract ONLY if label is exactly:
"KGS", "KG", "LBS", "LB", "Tons", "TONS", "TONE", "TON", "KGM",

----------------------------------
DOCUMENT TEXT:
`;



// -------------------- OCR FUNCTIONS --------------------
async function ocrImage(filePath) {
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    // Upload file
    const uploaded = await client.files.upload({
        file: {
            fileName: fileName,  // Changed from file_name to fileName
            content: fileBuffer,
        },
        purpose: "ocr"
    });

    // Process OCR
    const ocr = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "file",
            fileId: uploaded.id  // Changed from file_id to fileId
        }
    });

    const text = ocr.pages
        .filter(page => page.markdown)
        .map(page => page.markdown)
        .join('\n');

    // Cleanup
    try {
        await client.files.delete({ fileId: uploaded.id });
    } catch (err) {
        // Ignore cleanup errors
    }

    return text;
}

async function ocrPdf(filePath) {
    // For PDFs, use Mistral OCR directly
    // Mistral OCR can handle PDFs natively
    const fileBuffer = await fs.readFile(filePath);
    const fileName = path.basename(filePath);

    // Upload file
    const uploaded = await client.files.upload({
        file: {
            fileName: fileName,  // Changed from file_name to fileName
            content: fileBuffer,
        },
        purpose: "ocr"
    });

    // Process OCR - Mistral OCR supports PDFs
    const ocr = await client.ocr.process({
        model: "mistral-ocr-latest",
        document: {
            type: "file",
            fileId: uploaded.id  // Changed from file_id to fileId
        }
    });

    const text = ocr.pages
        .filter(page => page.markdown)
        .map(page => page.markdown)
        .join('\n');

    // Cleanup
    try {
        await client.files.delete({ fileId: uploaded.id });
    } catch (err) {
        // Ignore cleanup errors
    }

    return text;
}

function isMarkdownTable(text) {
    const lines = text.split('\n');
    const pipeLines = lines.filter(l => 
        l.trim().startsWith('|') && l.trim().slice(1).includes('|')
    );
    return pipeLines.length >= 3;
}

function extractGridTables(text) {
    const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const tables = [];
    let currentRows = [];

    for (const line of lines) {
        if (line.startsWith('|') && line.slice(1).includes('|')) {
            const cells = line.slice(1, -1).split('|').map(c => c.trim());

            // Ignore separator rows
            if (cells.every(c => c.replace(/-/g, '') === '')) {
                continue;
            }

            currentRows.push(cells);
        } else {
            if (currentRows.length >= 2) {
                tables.push(currentRows);
            }
            currentRows = [];
        }
    }

    if (currentRows.length >= 2) {
        tables.push(currentRows);
    }

    const structuredTables = [];

    for (const table of tables) {
        const headers = table[0];
        const rows = table.slice(1);

        const cleanRows = [];
        for (const row of rows) {
            const rowDict = {};
            for (let i = 0; i < Math.min(headers.length, row.length); i++) {
                if (headers[i] && row[i] && row[i] !== '---') {
                    rowDict[headers[i]] = row[i];
                }
            }
            if (Object.keys(rowDict).length > 0) {
                cleanRows.push(rowDict);
            }
        }

        if (cleanRows.length > 0) {
            structuredTables.push({ rows: cleanRows });
        }
    }

    return { tables: structuredTables };
}

function extractKeyValueBlocks(text) {
    const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l);
    
    const result = {};
    let i = 0;

    while (i < lines.length - 1) {
        const key = lines[i];
        const value = lines[i + 1];

        // Detect label-like lines
        const isLabel = (
            key.includes(':') ||
            key === key.toUpperCase() ||
            key.endsWith('No.') ||
            key.endsWith('Number')
        );

        // Avoid paragraphs
        if (isLabel && value.length < 200) {
            const cleanKey = key.replace(/:$/, '');
            if (!result[cleanKey]) {
                result[cleanKey] = value;
            }
            i += 2;
            continue;
        }

        i += 1;
    }

    return { key_value_blocks: result };
}

function extractTablesFromOcr(text) {
    if (isMarkdownTable(text)) {
        return extractGridTables(text);
    } else {
        return extractKeyValueBlocks(text);
    }
}

// -------------------- LLM EXTRACTION --------------------
async function extractJson(documentText) {
    const response = await client.chat.complete({
        model: "mistral-large-latest",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: "You must return ONLY a valid JSON object. " +
                        "Do not include markdown, explanations, comments, or text outside JSON."
            },
            {
                role: "user",
                content: EXTRACTION_PROMPT + documentText
            }
        ]
    });

    const raw = response.choices[0].message.content.trim();

    // Print raw model output (debug)
    console.log('\n' + '='.repeat(40));
    console.log('RAW MODEL OUTPUT:');
    console.log(raw);
    console.log('='.repeat(40) + '\n');

    // Safe JSON extraction
    try {
        const start = raw.indexOf('{');
        const end = raw.lastIndexOf('}') + 1;
        return JSON.parse(raw.substring(start, end));
    } catch (err) {
        throw new Error(`Invalid JSON returned by model: ${err.message}`);
    }
}

// -------------------- HARD VALIDATIONS --------------------
const ISO_CONTAINER_REGEX = /^(20|40|45)(GP|HC|HQ|DC|DV|RF|OT|FR)$/;

function sanitizeContainerType(data) {
    const ct = data?.container_details?.container_type;

    if (ct === null || ct === undefined) {
        return data;
    }

    if (!ISO_CONTAINER_REGEX.test(ct)) {
        data.container_details.container_type = null;
    }

    return data;
}

function safeFilename(filename) {
    const name = path.parse(filename).name;
    let safe = name.replace(/[<>:"/\\|?*]/g, '_');
    safe = safe.replace(/\s+/g, '_');
    return safe.replace(/^_+|_+$/g, '');
}

async function getUniqueFilepath(directory, filename) {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    let counter = 1;
    let candidate = path.join(directory, filename);

    while (fsSync.existsSync(candidate)) {
        candidate = path.join(directory, `${base}(${counter})${ext}`);
        counter++;
    }

    return candidate;
}

async function clearUploadFolder() {
    const files = await fs.readdir(UPLOAD_DIR);
    for (const filename of files) {
        const filePath = path.join(UPLOAD_DIR, filename);
        try {
            const stat = await fs.stat(filePath);
            if (stat.isFile()) {
                await fs.unlink(filePath);
            }
        } catch (err) {
            console.log(`Failed to delete ${filePath}: ${err.message}`);
        }
    }
}

function extractInvoiceTablesOnly(text) {
    const lines = text.split('\n')
        .map(l => l.trim())
        .filter(l => l);

    const invoiceMarkers = [
        "INVOICE",
        "TAX INVOICE",
        "Net Due",
        "SubTotal",
        "Total Amount"
    ];

    if (!invoiceMarkers.some(m => text.toLowerCase().includes(m.toLowerCase()))) {
        return {};
    }

    let headerIdx = -1;
    let headers = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
            line.startsWith('|') &&
            line.includes('S.No') &&
            line.includes('DESCRIPTION') &&
            line.includes('AMOUNT')
        ) {
            headerIdx = i;
            headers = line.slice(1, -1).split('|').map(h => h.trim());
            break;
        }
    }

    if (headerIdx === -1) {
        return {};
    }

    const invoiceRows = [];
    const invoiceTotals = [];

    for (let i = headerIdx + 1; i < lines.length; i++) {
        const line = lines[i];
        if (!line.startsWith('|')) {
            continue;
        }

        const cells = line.slice(1, -1).split('|').map(c => c.trim());

        if (cells.length > 0 && /^\d+$/.test(cells[0])) {
            const row = {};
            for (let j = 0; j < Math.min(headers.length, cells.length); j++) {
                row[headers[j]] = cells[j];
            }
            invoiceRows.push(row);
            continue;
        }

        if (cells.length >= 3 && /\d/.test(cells[cells.length - 1])) {
            invoiceTotals.push({
                label: cells[0],
                currency: cells[1],
                amount: cells[cells.length - 1]
            });
        }
    }

    return {
        invoice_rows: invoiceRows,
        invoice_totals: invoiceTotals
    };
}

/* ===================== API ===================== */

// router.post("/process", async (req, res) => {


//   try {

// console.log(req.files);

//     if (!req.files || !req.files.files) {
//       return res.status(400).json({ error: "No files uploaded" });
//     }

//     // Normalize single & multiple files
//     const uploadedFiles = Array.isArray(req.files.files)
//       ? req.files.files
//       : [req.files.files];

//     const results = [];

//     for (const file of uploadedFiles) {
//       const ext = file.name.toLowerCase().split(".").pop();
//       const baseName = safeFilename(file.name);

//       // Save temp file (because your OCR functions expect filePath)
//       const uploadPath = path.join(UPLOAD_DIR, file.name);
//       await fs.writeFile(uploadPath, file.data);

//       const outputPath = await getUniqueFilepath(
//         OUTPUT_DIR,
//         `${baseName}.json`
//       );
//       const tableOutputPath = await getUniqueFilepath(
//         TABLE_OUTPUT_DIR,
//         `${baseName}_tables.json`
//       );

//       let text;
//       if (["png", "jpg", "jpeg"].includes(ext)) {
//         text = await ocrImage(uploadPath);
//       } else if (ext === "pdf") {
//         text = await ocrPdf(uploadPath);
//       } else {
//         results.push({
//           file: file.name,
//           error: "Unsupported file type",
//         });
//         continue;
//       }

//       console.log(`OCR TEXT FOR FILE: ${file.name}`);

//       let extractedJson = await extractJson(text);
//       const tableJson = extractInvoiceTablesOnly(text);

//       extractedJson = sanitizeContainerType(extractedJson);

//       await fs.writeFile(
//         outputPath,
//         JSON.stringify(extractedJson, null, 2),
//         "utf-8"
//       );

//       if (Object.keys(tableJson).length > 0) {
//         await fs.writeFile(
//           tableOutputPath,
//           JSON.stringify(tableJson, null, 2),
//           "utf-8"
//         );
//       }

//       results.push({
//         file: file.name,
//         output_file: outputPath,
//         table_output_file: tableOutputPath,
//         data: extractedJson,
//         tables: tableJson,
//       });
//     }

//     await clearUploadFolder();

//     res.json({ status: "success", results });
//   } catch (error) {
//     console.error("Error processing files:", error);

//     try {
//       await clearUploadFolder();
//     } catch {}

//     res.status(500).json({
//       status: "error",
//       message: error.message,
//     });
//   }
// });

router.post("/process", async (req, res) => {
  try {
    console.log("FILES OBJECT:", req.files);

    // Field name must match Angular → CroFiles
    if (!req.files || !req.files.CroFiles) {
      return res.status(400).json({
        status: "error",
        message: "No files uploaded",
      });
    }

    // Normalize single / multiple
    const uploadedFiles = Array.isArray(req.files.CroFiles)
      ? req.files.CroFiles
      : [req.files.CroFiles];

    const results = [];

    for (const file of uploadedFiles) {
      const ext = file.name.toLowerCase().split(".").pop();
      const baseName = safeFilename(file.name);

      // Save file
      const uploadPath = path.join(UPLOAD_DIR, file.name);
      await fs.writeFile(uploadPath, file.data);

      const outputPath = await getUniqueFilepath(
        OUTPUT_DIR,
        `${baseName}.json`
      );

      const tableOutputPath = await getUniqueFilepath(
        TABLE_OUTPUT_DIR,
        `${baseName}_tables.json`
      );

      let text;

      if (["png", "jpg", "jpeg"].includes(ext)) {
        text = await ocrImage(uploadPath);
      } else if (ext === "pdf") {
        text = await ocrPdf(uploadPath);
      } else {
        results.push({
          file: file.name,
          error: "Unsupported file type",
        });
        continue;
      }

      console.log(`OCR TEXT FOR FILE: ${file.name}`);

      let extractedJson = await extractJson(text);
      const tableJson = extractInvoiceTablesOnly(text);

      extractedJson = sanitizeContainerType(extractedJson);

      // Save JSON
      await fs.writeFile(
        outputPath,
        JSON.stringify(extractedJson, null, 2),
        "utf-8"
      );

      if (Object.keys(tableJson).length > 0) {
        await fs.writeFile(
          tableOutputPath,
          JSON.stringify(tableJson, null, 2),
          "utf-8"
        );
      }

      results.push({
        file: file.name,
        output_file: outputPath,
        table_output_file: tableOutputPath,
        data: extractedJson,
        tables: tableJson,
      });
    }

    await clearUploadFolder();

    res.json({
      status: "success",
      results,
    });
  } catch (error) {
    console.error("Error processing files:", error);

    try {
      await clearUploadFolder();
    } catch {}

    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});
module.exports = router;
