import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 1️⃣ Email to GDG Admin (you)
    const adminMailOptions = {
      from: `"GDG MMMUT Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.MAIL_TO,
      subject: `[GDG Contact] ${subject}`,
      text: `
📩 New message from GDG MMMUT Contact Form

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
      `,
    };

    // 2️⃣ Auto-reply to the user
    const userMailOptions = {
      from: `"GDG MMMUT" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "We received your message – GDG MMMUT",
      text: `
Hi ${name},

Thank you for reaching out to GDG On Campus MMMUT! 🙌
We’ve received your message:

"${message}"

Our team will get back to you shortly.
Best regards,  
GDG On Campus MMMUT Team  
📍 Madan Mohan Malaviya University of Technology, Gorakhpur  
🌐 https://gdg.community.dev/
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    console.log(`✅ Contact email sent by ${name} (${email})`);
    res.status(200).json({ message: "Emails sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ error: "Failed to send email. Please try again later." });
  }
});

export default router;
