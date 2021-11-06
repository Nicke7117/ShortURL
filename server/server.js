require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
const db = require("./config/database");
const Url = require("./models/url");
const { nanoid } = require("nanoid");
const path = require("path");

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(
  "/scripts",
  express.static(path.join(__dirname, "/node_modules/axios/dist/"))
);
app.use("/static", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/views/index.html"));
});

app.post("/url/shorten", async (req, res) => {
  try {
    const url = req.query.url;
    const urlRegex =
      /^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i;
    if (!url || !urlRegex.test(url)) {
      res.status(400).json({ error: "Invalid url!" });
    }
    const [urlModel, created] = await Url.findOrCreate({
      where: { url: url },
      defaults: { url: url, id: nanoid(8) },
    });
    res.status(200).json({ id: urlModel.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/views/404.html"));
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

db.authenticate()
  .then(() => Url.sync())
  .catch((err) => console.log("Error: " + err));
