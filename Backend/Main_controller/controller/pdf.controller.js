const fs = require("fs");
const path = require("path");
const pdf = require("pdf-creator-node");

exports.generatePdf = async (req, res) => {
  try {
    // Load HTML template
    const html = fs.readFileSync(
      path.join(__dirname, "./view/lr-template.html"),
      "utf8"
    );

    // Load logo as base64
    const logoBase64 = fs.readFileSync(
      path.join(__dirname, "../../public/images/lagin.png"),
      "base64"
    );

    const requestData = req.body;
    requestData.logoBase64 = logoBase64;

    // Prepare copies
    const copies = [
      { ...requestData, CopyType: "POD Copy" },
      { ...requestData, CopyType: "Branch Copy" },
      { ...requestData, CopyType: "Consignee Copy" },
    ];

    // Ensure public folder exists
    const publicDir = path.join(__dirname, "../../public");
    const lrcopyDir = path.join(publicDir, "lrcopy");
if (!fs.existsSync(lrcopyDir)) fs.mkdirSync(lrcopyDir, { recursive: true });

    // Generate unique filename: BookingNo + timestamp
    const bookingNo = requestData.bookingNo || 'NA';
    const timestamp = Date.now();
    const fileName = `lrcopy_${bookingNo}_${timestamp}.pdf`;

    // Prepare PDF document
    const document = {
      html,
      data: { copies },
       path: path.join(lrcopyDir, fileName), 
      type: "",
    };

    // Generate PDF
    await pdf.create(document, {});
    console.log("PDF created:", fileName);

    // Return file URL

    //const host = req.protocol + '://' + req.get('host');
    // const host = req.protocol + '://' + req.get('host');n
    // const fileUrl = `${host}/LRCopy/${fileName}`;

    res.json({ success: true, file: fileName });

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({
      success: false,
      error: "PDF generation failed",
      message: err.message,
    });
  }
};
