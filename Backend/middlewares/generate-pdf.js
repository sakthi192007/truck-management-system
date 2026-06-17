const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();

doc.pipe(fs.createWriteStream('output.pdf'));

doc
  .fontSize(25)
  .text('Hello, World!', 100, 100);

doc
  .fontSize(12)
  .text('This is a sample PDF generated from HTML using Node.js.', {
    width: 410,
    align: 'left'
  });

doc.end();
