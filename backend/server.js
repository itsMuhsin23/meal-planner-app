
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./src/config/db.js";
import recipeRoutes   from "./src/routes/recipeRoutes.js";
import mealPlanRoutes from "./src/routes/mealPlanRoutes.js";

dotenv.config();
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/recipes",   recipeRoutes);
app.use("/api/meal-plan", mealPlanRoutes);

// Health check
app.get("/", (req, res) => res.json({ status: "API running" }));

// ─── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
