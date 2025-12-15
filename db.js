import pkg from "tunnel-ssh";
const { createTunnel } = pkg;
import pkg2 from "pg";
const { Pool } = pkg2;
import { readFileSync } from "fs";
console.log("Private key path =", process.env.SSH_PRIVATE_KEY);

/* ---------------- SSH + DB SETUP ---------------- */

const sshOptions = {
  host: process.env.SSH_HOST,
  port: 22,
  username: process.env.SSH_USER,
  privateKey: readFileSync(process.env.SSH_PRIVATE_KEY),
  passphrase: process.env.SSH_PASSPHRASE
};

const tunnelOptions = { autoClose: true };

const forwardOptions = {
  srcAddr: process.env.LOCAL_HOST,
  srcPort: Number(process.env.LOCAL_PORT),
  dstAddr: process.env.REMOTE_HOST,
  dstPort: Number(process.env.REMOTE_PORT)
};

const serverOptions = {
  port: Number(process.env.LOCAL_PORT)
};

console.log("Starting SSH tunnel...");

const connection = new Promise((resolve, reject) => {
  createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions)
    .then(([server, client]) => {
      console.log("SSH tunnel established, creating DB pool");

      const db = new Pool({
        host: process.env.LOCAL_HOST,
        port: Number(process.env.LOCAL_PORT),
        database: process.env.DATABASE_NAME,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
      });

      console.log("Database connection initializing");
      resolve(db);
    })
    .catch((err) => {
      console.error("Error creating SSH tunnel:", err);
      reject(err);
    });
});

/* ---------------- CRUD FUNCTIONS ---------------- */

// READ all teams
const readTeams = (req, res) => {
  connection
    .then((conn) => {
      conn.query(
        "SELECT teamid, teamname, abbrev, homecity FROM project.team ORDER BY teamid",
        (error, results) => {
          if (error) {
            console.error("Error in readTeams:", error);
            res.status(500).send("Error reading teams");
            return;
          }
          res.status(200).json(results.rows);
        }
      );
    })
    .catch((err) => {
      res.status(500).send("DB connection error in readTeams");
    });
};

// CREATE a new team
const createTeam = (req, res) => {
  const { teamid, teamname, homecity, abbrev, divisionid } = req.body;

  if (!teamid || !teamname || !homecity || !abbrev || !divisionid) {
    res.status(400).send("Missing required fields");
    return;
  }

  connection
    .then((conn) => {
      conn.query(
        `INSERT INTO project.team 
         (teamid, teamname, abbrev, homecity, divisionid)
         VALUES ($1, $2, $3, $4, $5)`,
        [teamid, teamname, abbrev, homecity, divisionid],
        (error) => {
          if (error) {
            console.error("Error in createTeam:", error);
            res.status(500).send("Error creating team");
            return;
          }
          res.status(201).send("Team added");
        }
      );
    })
    .catch((err) => {
      console.error("DB connection error in createTeam:", err);
      res.status(500).send("DB connection error");
    });
};

// UPDATE a team
const updateTeam = (req, res) => {
  const id = req.params.id;
  const { teamname, homecity } = req.body;

  connection
    .then((conn) => {
      conn.query(
        `UPDATE project.team 
         SET teamname = $1, homecity = $2 
         WHERE teamid = $3`,
        [teamname, homecity, id],
        (error) => {
          if (error) {
            console.error("Error updating team:", error);
            res.status(500).send("Error updating");
            return;
          }
          res.status(200).send("Team updated");
        }
      );
    })
    .catch((err) => {
      res.status(500).send("DB connection error");
    });
};

// DELETE a team
const deleteTeam = (req, res) => {
  const id = req.params.id;

  connection
    .then((conn) => {
      conn.query(
        "DELETE FROM project.team WHERE teamid = $1",
        [id],
        (error) => {
          if (error) {
            console.error("Error deleting team:", error);
            res.status(500).send("Error deleting");
            return;
          }
          res.status(200).send("Team deleted");
        }
      );
    })
    .catch((err) => {
      res.status(500).send("DB connection error");
    });
};

/* ---------------- EXPORTS ---------------- */

export { connection, readTeams, createTeam, updateTeam, deleteTeam };
