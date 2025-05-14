import mongoose from "mongoose";

const premiumCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const PremiumCode = mongoose.model("PremiumCode", premiumCodeSchema);
export default PremiumCode;
