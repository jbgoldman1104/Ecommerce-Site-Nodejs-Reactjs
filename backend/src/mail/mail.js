const nodemailer = require("nodemailer");
require("dotenv").config();

const { EMAIL_ADDR, EMAIL_PASS } = process.env;
const transporter = nodemailer.createTransport({
  service: "hotmail",
  auth: { user: EMAIL_ADDR, pass: EMAIL_PASS },
});

const sendMail = (to, subject, text, PDFFilePath) => {
  let options = {
    from: EMAIL_ADDR,
    to,
    subject,
    text,
  };
  if (PDFFilePath) {
    options["attachments"] = [
      {
        filename: "order.pdf",
        path: PDFFilePath,
        contentType: "application/pdf",
      },
    ];
  }
  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log(info.response);
  });
};

module.exports = { sendMail };
