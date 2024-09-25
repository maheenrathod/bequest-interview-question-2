import express from "express";
import cors from "cors";

const PORT = 8080;
const app = express();

/**
 * temporary database that stores data, its hash value,
 * as well as backups for recovery.
 * ideally, this would be done with external databases
 * like PostgreSQL or AWS S3 bucket
 */
type Database = {
  data: string;
  hash?: string;
  prevData?: string;
}

const database: Database = { data: "Hello World" };

app.use(cors());
app.use(express.json());

// Generating hash values of data 
const crypto = require('node:crypto');

/* * HASHING - CRYPTO NODE MODULE
 * createHash uses the sha256 algorithm to generate a hash key
 * update method feeds data to the hash object
 * a hash digest is created using the hex encoding
 * */
const generateHash = (data: string) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Routes

/** MODIFIED GET USING HASHING
 * retrieves the data and its corresponding hash
 */
app.get("/", (req, res) => {
    res.json({data: database.data, hash: database.hash});
});

/** MODIFIED POST
 * every new data has its own hash generated and
 * stored within database
 */
app.post("/", (req, res) => {
  const data = req.body.data;
  const hash = generateHash(data);

  // backs up the old data for future recovery
  database.prevData = data;

  database.data = data;
  database.hash = hash;

  res.sendStatus(200);
});

app.post("/recover", (req, res) => {
  if(database.prevData) {
    database.data = database.prevData;
    database.hash = generateHash(database.prevData);
    res.json({ data: database.data})
  } else {
    res.status(404).json({ error: "No backup found" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
