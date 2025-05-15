app.post("/save", (req, res) => {
  console.log("Received POST request:", req.body); // ADD THIS

  const { username, password } = req.body;
  if (!username || !password) {
    console.error("Missing username or password"); // ADD THIS
    return res.status(400).send("Missing username or password");
  }

  try {
    const rawData = fs.readFileSync(DATA_FILE, "utf-8");
    console.log("Raw file data:", rawData); // ADD THIS

    const users = JSON.parse(rawData);
    users.push({ username, password, time: new Date().toISOString() });

    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2), "utf-8");

    console.log("User saved successfully"); // ADD THIS
    res.send("Saved successfully!");
  } catch (err) {
    console.error("Error during saving:", err); // ADD THIS
    res.status(500).send("Internal Server Error");
  }
});
