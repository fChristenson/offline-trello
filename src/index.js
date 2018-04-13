const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const board = require("./lib/board");

let savedBoard = board;

const makePath = name => {
  return path.resolve(__dirname, "..", "public", name);
};

app.use(express.static(path.resolve(__dirname, "..", "public")));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(makePath("index.html"));
});

app.get("/board", (req, res) => {
  res.json(savedBoard);
});

app.post("/board", (req, res) => {
  savedBoard = req.body;
  return res.json(savedBoard);
});

module.exports = app;
