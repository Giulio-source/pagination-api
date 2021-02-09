require("dotenv").config();

const express = require("express");
const app = express();

const users = [
  { id: 1, name: "Gigi" },
  { id: 2, name: "Luigi" },
  { id: 3, name: "Remigio" },
  { id: 4, name: "Marco" },
  { id: 5, name: "Luca" },
  { id: 6, name: "Stefano" },
  { id: 7, name: "Michele" },
  { id: 8, name: "Simone" },
  { id: 9, name: "Giorgio" },
  { id: 10, name: "Tommaso" },
  { id: 11, name: "Giacomo" },
  { id: 12, name: "Alex" },
];

app.get("/users", paginatedResults(users), (req, res) => {
  res.json(res.paginatedResults);
});

function paginatedResults(model) {
  return (req, res, next) => {
    const page = req.query.page;
    const limit = req.query.limit;
    const startIndex = (page - 1) * limit;
    const endIndex = parseInt(startIndex) + parseInt(limit);
    const results = {};
    if (endIndex < model.length) {
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

    results.results = model.slice(startIndex, endIndex);
    res.paginatedResults = results;
    next();
  };
}

app.listen(process.env.PORT || 3000, () => {
  console.log("Listening on port 3000");
});
