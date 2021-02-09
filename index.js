require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const User = require("./model/UserSchema");
const app = express();

mongoose.connect("mongodb://localhost/paginazione", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", (err) => {
  console.log(err);
});
db.once("open", async () => {
  if ((await User.countDocuments().exec()) > 0) return;

  Promise.all([
    User.create({ name: "User1" }),
    User.create({ name: "User2" }),
    User.create({ name: "User3" }),
    User.create({ name: "User4" }),
    User.create({ name: "User5" }),
    User.create({ name: "User6" }),
    User.create({ name: "User7" }),
    User.create({ name: "User8" }),
    User.create({ name: "User9" }),
    User.create({ name: "User10" }),
    User.create({ name: "User11" }),
    User.create({ name: "User12" }),
    User.create({ name: "User13" }),
    User.create({ name: "User14" }),
    User.create({ name: "User15" }),
  ]).then(console.log("Added Users"));

  console.log("Connected to DB");
});

app.get("/users", paginatedResults(User), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const page = req.query.page;
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = parseInt(startIndex) + limit;
    const results = {};
    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        page: parseInt(page) + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      results.prev = {
        page: parseInt(page) - 1,
        limit: limit,
      };
    }
    try {
      results.results = await model.find().limit(limit).skip(startIndex).exec();
      res.paginatedResults = results;
      next();
    } catch (error) {
      console.log(error);
    }
  };
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
