import mongoose from "mongoose";

const run = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/empreinte", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connexion OK");
    process.exit(0);
  } catch (e) {
    console.error("❌ Connexion échouée :", e.message);
    process.exit(1);
  }
};

run();
