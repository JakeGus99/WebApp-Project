import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import {
  readTeams,
  createTeam,
  updateTeam,
  deleteTeam
} from "./db.js";

const app = express();
const port = 3000;

// Needed for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the webapp folder
app.use(express.static(path.join(__dirname, "webapp")));

// Serve index.html when someone goes to /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// REST API
app.get("/teams", readTeams);
app.post("/teams", createTeam);
app.put("/teams/:id", updateTeam);
app.delete("/teams/:id", deleteTeam);

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
