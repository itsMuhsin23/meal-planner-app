import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import recipeRoutes from "./src/routes/recipeRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ✅ VERY IMPORTANT
app.use(express.json());

app.use("/api/recipes", recipeRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});