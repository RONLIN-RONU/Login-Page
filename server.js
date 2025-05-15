const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const DATA_FILE = path.join(__dirname, "savedUsers.json");

// Create savedUsers.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]");
}

app.post("/save", (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send("Missing username or password");
    }

    let users = [];
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    users = JSON.parse(data);

    users.push({ username, password, time: new Date().toISOString() });
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));

    res.send("Saved successfully!");
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

