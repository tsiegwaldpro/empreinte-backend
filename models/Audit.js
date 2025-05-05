import mongoose from "mongoose";

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
    recommandations: Array,
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
