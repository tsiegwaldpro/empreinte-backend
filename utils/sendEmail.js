// utils/sendEmail.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Log sécurité (ne montre pas le mot de passe, mais utile en debug)
console.log("📤 SMTP_USER =", process.env.SMTP_USER);
console.log("📤 MAIL_FROM =", process.env.MAIL_FROM || "(non défini)");

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
  const from = process.env.MAIL_FROM;

  if (!from) {
    console.error("❌ MAIL_FROM est vide ou non défini.");
    throw new Error("Adresse d’expéditeur manquante");
  }

  try {
    const info = await transporter.sendMail({
      from: `"Empreinte" <${from}>`,
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
