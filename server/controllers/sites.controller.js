import Site from "../models/Site.js";
import { v4 as uuidv4 } from "uuid";

export const createSite = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { title } = req.body;

    const slug = `${title?.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(0,6)}`;

    const site = await Site.create({
      userId,
      title: title || "My New Portfolio",
      slug,
      template: "demo",
      data: {},
    });

    res.status(201).json(site);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating site" });
  }
};

export const getUserSites = async (req, res) => {
  try {
    const userId = req.user.id;
    const sites = await Site.findAll({ where: { userId } });
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sites" });
  }
};

export const getSiteBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const site = await Site.findOne({ where: { slug } });
    if (!site) return res.status(404).json({ error: "Site not found" });
    res.json(site);
  } catch (error) {
    res.status(500).json({ error: "Error fetching site" });
  }
};
