import express from "express";
import apiRoutes from "./api/index.js";

const app = express();
app.use(express.json());

app.use("/api", apiRoutes);  

// ...
