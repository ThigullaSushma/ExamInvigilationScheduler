const express = require("express");
const sendEmail = require("./Mailer");

const router = express.Router();

router.post("/send", async (req, res) => {
  
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: "✅ Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "❌ Failed to send email" });
  }
});

module.exports = router;
