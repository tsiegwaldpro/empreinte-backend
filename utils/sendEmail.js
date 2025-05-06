import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (toEmail, token) => {
  const confirmationLink = `http://localhost:5173/confirm/${token}`;

  try {
    const result = await resend.emails.send({
      from: "Empreinte <onboarding@resend.dev>",
      to: toEmail,
      subject: "Confirme ton inscription à Empreinte ✅",
      html: `
        <h1>Bienvenue sur Empreinte !</h1>
        <p>Merci pour ton inscription 🙏</p>
        <p>Avant de commencer, clique ici pour confirmer ton compte :</p>
        <a href="${confirmationLink}">${confirmationLink}</a>
      `,
    });

    console.log("✅ Mail de confirmation envoyé :", result);
  } catch (err) {
    console.error("❌ Erreur lors de l'envoi du mail :", err);
  }
};
