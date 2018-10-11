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

function preview(segments) {
  const cap = 100;

  const lens = segments
    .map((seg) => seg[1].length)
    .reduce((accum, len) => [
      ...accum,
      accum.slice(-1)[0] + len
    ], [0]);

  
  const limit = lens.find(len => len > cap);
  const i = lens.indexOf(limit) - 1;

  if (i === -1) {
    return segments;
  }

  const first = segments.slice(0, i);
  const last = segments[i];

  const firstLen = first.map(([, text]) => text.length);
  return [...first, [
    last[0],
    last[1].substr(0, cap - firstLen)
  ]];
}

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
        preview(segs)
      ]);
    })
    .reduce((accum, curr) => [...accum, ...curr], []);

  res.json(found);
});


app.listen(8989);
