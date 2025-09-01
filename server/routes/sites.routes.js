import express from "express";
import { createSite, getUserSites, getSiteBySlug } from "../controllers/sites.controller.js";

const router = express.Router();

router.post("/", createSite);

router.get("/my", getUserSites);

router.get("/:slug", getSiteBySlug);

export default router;
