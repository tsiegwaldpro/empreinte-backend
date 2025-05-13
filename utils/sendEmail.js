// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.sendinblue.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Empreinte" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("✅ Mail envoyé :", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Erreur envoi mail :", error);
    throw error;
  }
};
