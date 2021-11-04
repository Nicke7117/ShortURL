require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
const db = require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.post("/url/shorten", (req, res) => {
  const url = req.query.url;
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
db.authenticate()
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("Error: " + err));
