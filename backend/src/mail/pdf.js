const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// generatePDF creates PDF file based on given arguments
const generatePDF = (filename, to, subject, text, PDFOrders) => {
  // Create a document
  const doc = new PDFDocument();

  const PDFFilePath = path.join(__dirname, "../../orders", filename);
  const PDFLogoPath = path.join(__dirname, "./assets", "basketball.jpg");
  doc.pipe(fs.createWriteStream(PDFFilePath));

  // Add an image, constrain it to a given size, and center it vertically and horizontally
  doc.image(PDFLogoPath, (doc.page.width - 120) / 2, 10, {
    fit: [120, 120],
    align: "center",
    valign: "center",
  });

  doc
    .fillColor("#FF5722")
    .fontSize(25)
    .text("BasketStore", doc.page.width / 2 - 66, 150);
  doc.fontSize(22).fillColor("black").text(subject, 100);
  doc.fontSize(16).text(to);

  for (let o of PDFOrders) {
    if (o && o.count && o.productName) {
      doc
        .fontSize(14)
        .text(`${o.count}- ${o.productName} `)
        .text(`${o.unitPrice}$`)
        .fontSize(12)
        .text(o.URL);

      doc.moveDown();
      doc.moveDown();
    }
  }
  doc.text(`Total ${PDFOrders[PDFOrders.length - 1]}$`);

  // Finalize PDF file
  doc.end();
  return PDFFilePath;
};

const orderPDF = (filename, to, subject, PDFOrders) => {
  // Create a document
  const doc = new PDFDocument();

  const PDFFilePath = path.join(__dirname, "../../orders", filename);
  doc.pipe(fs.createWriteStream(PDFFilePath));

  doc
    .fillColor("#FF5722")
    .fontSize(25)
    .text("BasketStore", doc.page.width / 2 - 66, 150);
  doc.fontSize(22).fillColor("black").text(subject, 100);
  if (to) {
    doc.fontSize(16).text(to);
  }

  let totalCount = 0;
  for (let o of PDFOrders.products) {
    console.log("o ", o);
    if (o && o.productName) {
      doc
        .fontSize(14)
        .text(`${o.productName} `)
        .text(`${o.description}$`)
        .text(`${o.unitPrice}$`)
        .fontSize(12)
        .text(o.URL);

      doc.moveDown();
      doc.moveDown();
      totalCount += o.unitPrice;
    }
  }
  doc.text(`Total ${totalCount}$`);

  // Finalize PDF file
  doc.end();
  return PDFFilePath;
};

module.exports = { generatePDF, orderPDF };
