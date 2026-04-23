import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { seedRecipes } from "./seeders/recipeSeed.js";

dotenv.config();

const runSeed = async () => {
  await connectDB();
  await seedRecipes();
  process.exit();
};

runSeed();