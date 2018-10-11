const express = require("express");
const path = require("path");

const index = require("./svetym.json");
const indexKeys = Object.keys(index);

app = express();

app.get("/api/entry/:entry/:defNo", (req, res) => {
  const defNo = req.params.defNo;
  const entry = req.params.entry.toLowerCase();
  const definitions = index[entry];
  if (definitions == null) {
    res.sendStatus(404);
  } else {
    const definition = definitions[defNo - 1];
    if (definition == null) {
      res.sendStatus(404);
    } else {
      res.json(definition);
    }
  }
});

app.get("/api/search/:query", (req, res) => {
  const query = req.params.query.toLowerCase();
  
  const found = indexKeys
    .filter(key => key.indexOf(query) !== -1)
    .slice(0, 25)
    .map(key => {
      const defs = index[key];
      return defs.map(([, segs], i) => [
        key,
        i + 1,
        segs.slice(0, 10)
      ]);
    })
    .reduce((accum, curr) => [...accum, ...curr], []);

  res.json(found);
});


app.listen(8989);
