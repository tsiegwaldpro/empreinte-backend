// models/Audit.js

import mongoose from "mongoose";

// Sous-schéma pour une recommandation simplifiée dans l'audit
const RecommandationSchema = new mongoose.Schema(
  {
    id: { type: String, required: true }, // Identifiant unique de la reco
    group: String, // Groupe (ex : "performance")
    title: String, // Titre de la reco
    description: String, // Description (optionnel)
    impact: Number, // Impact ou score
    impactLevel: String, // Niveau d'impact (ex : "💥")
    displayValue: String, // Valeur à afficher (ex : "86%")
    // on retire le champ actions, qui sera injecté dynamiquement
  },
  { _id: false }
);

const AuditSchema = new mongoose.Schema(
  {
    url: String,
    performance: Number,
    accessibility: Number,
    bestPractices: Number,
    seo: Number,
    totalByteWeight: String,
    domSize: String,
    requests: Number,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommandations: [RecommandationSchema], // recos sans actions (actions injectées dynamiquement)
    empreinte: {
      ecoIndex: Number,
      gesPerVisit: String,
      energyPerVisit: String,
      waterPerVisit: String,
      ges100Visits: String,
      water100Visits: String,
    },
    // ✅ CHAMP AJOUTÉ : tous les audits lighthouse bruts par id (sert aux actions dynamiques)
    lighthouseAudits: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Audit", AuditSchema);
