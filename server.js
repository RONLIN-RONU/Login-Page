<<<<<<< HEAD
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;  // Use environment port or 3000 locally

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "savedUsers.json");

// Ensure the file exists on server startup
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

// Serve index.html on root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Read users from file
function readUsers() {
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

// Save users to file
function saveUsers(users) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");
}

// Save login info
app.post("/save", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).send("Missing fields");

  const users = readUsers();
  users.push({ username, password, time: new Date().toISOString() });
  saveUsers(users);
  res.send("Saved successfully!");
});

// View saved info (basic auth)
app.get("/saved", (req, res) => {
  const auth = req.headers.authorization || "";
  const [user, pass] = Buffer.from(auth.split(" ")[1] || "", "base64")
    .toString("ascii")
    .split(":");

  if (user === "admin" && pass === "admin123") {
    const users = readUsers();
    res.json(users);
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    res.status(401).send("Authentication required");
=======
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Save user data to file
app.post('/submit', (req, res) => {
  const { username, phone, email, password } = req.body;

  const newUser = {
    username,
    phone,
    email,
    password,
    timestamp: new Date().toISOString()
  };

  const filePath = path.join(__dirname, 'savedUsers.json');

  let users = [];
  if (fs.existsSync(filePath)) {
    users = JSON.parse(fs.readFileSync(filePath));
  }

  users.push(newUser);
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));

  res.send('✅ User information saved successfully!');
});

// View saved user data
app.get('/view', (req, res) => {
  const filePath = path.join(__dirname, 'savedUsers.json');

  if (fs.existsSync(filePath)) {
    const users = JSON.parse(fs.readFileSync(filePath));
    res.json(users);
  } else {
    res.json([]);
>>>>>>> 89dc140 (Update index.html inside public folder)
  }
});

app.listen(PORT, () => {
<<<<<<< HEAD
<<<<<<< HEAD
  console.log(`✅ Server running at http://localhost:${PORT}`);
=======
  console.log(`Server running on http://localhost:${PORT}`);
>>>>>>> 89dc140 (Update index.html inside public folder)
=======
  console.log(`🚀 Server running on http://localhost:${PORT}`);
>>>>>>> ff6a848 (Fixed form action and added email/phone inputs)
});
