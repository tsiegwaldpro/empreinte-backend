import RecoCatalog from "../models/RecoCatalog.js";

// Liste toutes les reco avec actions
const listRecos = async (req, res) => {
  try {
    const recos = await RecoCatalog.find().sort({ group: 1, title: 1 });
    res.json(recos);
  } catch (err) {
    console.error("Erreur liste reco catalog:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Création ou mise à jour d’une reco (upsert)
const upsertReco = async (req, res) => {
  try {
    const { id, title, group, description, impact, impactLevel, actions } =
      req.body;
    if (!id || !title || !group) {
      return res
        .status(400)
        .json({ message: "id, title et group sont obligatoires" });
    }
    const updated = await RecoCatalog.findOneAndUpdate(
      { id },
      { id, title, group, description, impact, impactLevel, actions },
      { upsert: true, new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Erreur upsert reco catalog:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// Suppression d’une reco par id
const deleteReco = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "id manquant" });

    const deleted = await RecoCatalog.findOneAndDelete({ id });
    if (!deleted) return res.status(404).json({ message: "Reco non trouvée" });

    res.json({ message: "Reco supprimée" });
  } catch (err) {
    console.error("Erreur suppression reco catalog:", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

export { listRecos, upsertReco, deleteReco };
