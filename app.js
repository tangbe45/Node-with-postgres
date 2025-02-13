const express = require("express");
const database = require("./services/database");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "This is your responds" });
});

app.listen(3001, () => console.log("Server running on port 3001"));
