

import express from "express";
import cors from "cors";
import recipeRoutes from "./routes/recipeRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/recipes", recipeRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

export default app;