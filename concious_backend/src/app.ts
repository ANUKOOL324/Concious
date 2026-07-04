import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", apiRoutes);

export default app;
