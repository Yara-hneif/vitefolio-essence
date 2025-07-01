// Controller logic for handling project-related requests.
// It imports the model function to fetch projects from the database and handles errors appropriately.
import { getAllProjectsFromDB } from "../models/projectModel.js";

export const getAllProjects = async (req, res) => {
  try {
    const projects = await getAllProjectsFromDB();
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
