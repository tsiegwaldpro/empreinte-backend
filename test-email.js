// test-email.js
import dotenv from "dotenv";
import { sendWelcomeEmail } from "./utils/sendEmail.js";

dotenv.config();
await sendWelcomeEmail("siegwald.thomas@gmail.com");
