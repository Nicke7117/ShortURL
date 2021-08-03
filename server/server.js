require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
const db = require("./config/database");

db.authenticate().then(() =>
  console
    .log("Database connected!")
    .catch((err) => console.log("Error: " + err))
);

app.use(cors());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
