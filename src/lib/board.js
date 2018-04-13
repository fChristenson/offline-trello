const Column = require("./column");
const Card = require("./card");

let cards = [];

for (let i = 1; i <= 5; i++) {
  cards.push(new Card(`foo ${i}`, "This is a foo"));
}

const board = {
  backlog: new Column("backlog", cards),
  doing: new Column("doing"),
  testing: new Column("testing"),
  done: new Column("done")
};

module.exports = board;
