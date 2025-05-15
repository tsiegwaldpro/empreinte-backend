import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    code: { type: String },
  },
  { _id: false }
);

const RecoCatalogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // identifiant unique reco
  title: { type: String, required: true },
  group: { type: String, required: true },
  description: { type: String },
  impact: { type: Number },
  impactLevel: { type: String },
  actions: [ActionSchema],
});

export default mongoose.model("RecoCatalog", RecoCatalogSchema);
