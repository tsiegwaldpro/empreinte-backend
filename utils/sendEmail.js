import { Resend } from "resend";

const resend = new Resend("re_LFfT1qwa_KjvNWbkQzhCgRWwdSRPi3qKA");

export async function sendWelcomeEmail(to) {
  try {
    await resend.emails.send({
      from: "Empreinte <noreply@tondomaine.com>",
      to,
      subject: "Bienvenue sur Empreinte !",
      html: `<p>Merci pour ton inscription sur Empreinte 👣<br>On est ravi de t’avoir avec nous !</p>`,
    });
  } catch (err) {
    console.error("Erreur envoi email :", err.message);
  }
}
