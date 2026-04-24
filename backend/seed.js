import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import { seedRecipes } from "./src/seeders/recipeSeed.js";

dotenv.config();

const runSeed = async () => {
  await connectDB();
  await seedRecipes();
  process.exit();
};

runSeed();