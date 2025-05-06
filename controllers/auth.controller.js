import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

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

    console.log(
      "📧 Envoi de l'email de confirmation avec token :",
      confirmationToken
    );
    await sendWelcomeEmail(user.email, confirmationToken);

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
