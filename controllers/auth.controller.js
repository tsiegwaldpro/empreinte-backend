import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";

const baseUrl = process.env.URL || "https://www.empreinte-app.fr/";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 🟢 Register
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email déjà utilisé." });

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });
    await user.save();

    const confirmationToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: "1d",
    });

    await sendEmail({
      to: user.email,
      subject: "Confirme ton compte Empreinte 🐾",
      html: `
    <h1>Bienvenue ${user.firstName} 👋</h1>
    <p>Merci de t’être inscrit sur Empreinte !</p>
    <p>Pour activer ton compte, clique ici :</p>
    <a href="${baseUrl}confirm/${confirmationToken}">Confirmer mon compte</a>
    <p><small>Ce lien expire dans 24h.</small></p>
  `,
    });
    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Identifiants incorrects" });

    if (!user.confirmed)
      return res
        .status(403)
        .json({ message: "Compte non confirmé. Vérifie tes mails." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Identifiants incorrects" });

    const token = generateToken(user);
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// 🔵 Me
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    if (user.confirmed)
      return res.status(400).json({ message: "Compte déjà confirmé" });

    user.confirmed = true;
    await user.save();

    res.json({ message: "✅ Compte confirmé avec succès" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Token invalide ou expiré", error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Aucun compte avec cet email" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    await sendEmail({
      to: user.email,
      subject: "🔐 Réinitialise ton mot de passe",
      html: `
    <h2>Demande de réinitialisation</h2>
    <p>Tu as demandé à réinitialiser ton mot de passe ? Clique ici :</p>
   <a href="${baseUrl}reset-password/${token}">Réinitialiser</a>
    <p><small>Ce lien est valable 1h. Si ce n'était pas toi, ignore ce message.</small></p>
  `,
    });
    res.json({
      message: "📬 Un mail t’a été envoyé avec un lien de réinitialisation.",
    });
  } catch (err) {
    console.error("Erreur forgotPassword:", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(404).json({ message: "Utilisateur introuvable" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "🔑 Mot de passe mis à jour avec succès" });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Lien invalide ou expiré", error: err.message });
  }
};
