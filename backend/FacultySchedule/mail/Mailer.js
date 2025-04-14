require("dotenv").config();
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });


    let mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: text,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: " + info.response);
  } catch (error) {
    console.error("❌ Error sending email: ", error);
  }
};

module.exports = sendEmail;
