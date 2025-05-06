import mongoose from "mongoose";

// Sous-schéma pour une action concrète
const ActionSchema = new mongoose.Schema(
  {
    label: String,
    code: String,
  },
  { _id: false }
);

// Sous-schéma pour une recommandation
const RecommandationSchema = new mongoose.Schema(
  {
    id: String,
    group: String,
    title: String,
    description: String,
    impact: Number,
    impactLevel: String,
    displayValue: String,
    actions: [ActionSchema],
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
    recommandations: [RecommandationSchema],
    empreinte: {
      ecoIndex: Number,
      gesPerVisit: String,
      energyPerVisit: String,
      waterPerVisit: String,
      ges100Visits: String,
      water100Visits: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Audit", AuditSchema);
