const express = require("express");
const path = require("path");

const index = require("./svetym.json");
const indexKeys = Object.keys(index);

app = express();

app.get("/api/entry/:entry/:defNo", (req, res) => {
  const {defNo, entry} = req.params;

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

function sum(a, b) {
  return a+b;
}

function caseInsMatch(needle, haystack) {
  return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
}

function preview(segments) {
  const cap = 100;

  const lens = segments.map(([, text]) => text.length);
  const cumLens =lens.map((len, i, arr) => arr.slice(0, i+1).reduce(sum));
  
  const limit = cumLens.find(len => len > cap);
  const i = cumLens.indexOf(limit);

  if (i === -1) {
    return [segments, false];
  }

  const first = segments.slice(0, i);
  const last = segments[i];

  const firstLen = first.map(([, text]) => text.length).reduce(sum);
  const shortened = [...first, [
    last[0],
    last[1].substr(0, cap - firstLen)
  ]];

  return [shortened, true];
}

app.get("/api/search/:query", (req, res) => {
  const query = req.params.query;
  
  const found = indexKeys
    .filter(key => caseInsMatch(query, key))
    .slice(0, 25)
    .map(key => {
      const defs = index[key];
      return defs.map(([, segs], i) => ({
        entry: key,
        defNo: i + 1,
        preview: preview(segs)
      }));
    })
    .reduce((accum, curr) => [...accum, ...curr], []);

  res.json(found);
});


app.listen(8989);
