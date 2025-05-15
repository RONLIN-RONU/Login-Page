onst express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express(); // ✅ THIS IS REQUIRED
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "savedUsers.json");

// Ensure data file exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// POST handler with logging
app.post("/save", (req, res) => {
  console.log("Received POST request:", req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    console.error("Missing username or password");
    return res.status(400).send("Missing username or password");
  }

  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    console.log("Raw file data:", rawData);

    const users = JSON.parse(rawData);
    users.push({ username, password, time: new Date().toISOString() });

    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
    console.log("User saved successfully");

    res.send("Saved successfully!");
  } catch (err) {
    console.error("Error during saving:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
