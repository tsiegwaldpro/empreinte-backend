import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST || "mail.empreinte-app.fr",
  port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT) : 465,
  secure: true, // true pour SSL sur port 465
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
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
