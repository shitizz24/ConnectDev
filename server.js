const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const posts = require("./routes/api/posts");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = require("./config/keys").mongodbURI;
const MongoClient = require("mongodb").MongoClient;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello guys"));

app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server running on port " + port));
