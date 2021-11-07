require("dotenv").config();
const express = require("express");
const app = express();
const port = 5000 || process.env.PORT;
const cors = require("cors");
const db = require("./config/database");
const Url = require("./models/url");
const { nanoid } = require("nanoid");
const path = require("path");
const validator = require("validator");
const rateLimit = require("express-rate-limit");

const shortenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
});

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

app.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const url = await Url.findOne({ where: { id: id } });
    res.redirect(301, "https://" + url.url);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

app.post("/url/shorten", shortenLimiter, async (req, res) => {
  try {
    const url = req.query.url;
    if (!validator.isURL(url)) {
      res.status(400).json({ error: "Invalid url!" });
    } else {
      const urlWithoutProtocol = url.replace(
        /^(?:https?:\/\/)?(?:www\.)?/i,
        ""
      );
      console.log("The url without protocol: " + urlWithoutProtocol);
      const urlModel = await Url.findOrCreate({
        where: { url: urlWithoutProtocol },
        defaults: { url: urlWithoutProtocol, id: nanoid(7) },
      });
      res.status(200).json({ id: urlModel.id });
    }
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
