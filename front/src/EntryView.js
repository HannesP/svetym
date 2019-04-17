import React, { Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import Segments from "./Segments";

function RunebergLink({ pageNo }) {
  const str = String(pageNo);
  const pad = Array(4 - str.length)
    .fill("0")
    .join("");
  const href = `http://runeberg.org/svetym/${pad + str}.html`;
  return <a href={href}>ᚱ</a>;
}

function NotFound({ word }) {
  return (
    <span>
      The word{" "}
      <span style={{ fontWeight: "bold" }}>
        <sup>10</sup>
        {word}
      </span>{" "}
      is not in the dictionary.
    </span>
  );
}

function Loading() {
  return <span className="loading" />;
}

function useEntry(word, defNo) {
  const [entry, setEntry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const res = await fetch(`/api/entry/${word}/${defNo}`);
      const data = res.ok ? await res.json() : null;

      if (alive) {
        setEntry(data);
        setIsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [word, defNo]);

  return { entry, isLoading };
}

export default function EntryView(props) {
  const { word, defNo } = props.match.params;
  const { entry, isLoading } = useEntry(word, defNo);

  if (isLoading) {
    return <Loading />;
  }

  if (entry == null) {
    return <NotFound word={word} />;
  }

  const [pageNo, segments] = entry;

  return (
    <Fragment>
      <Helmet title={word} />
      {isLoading ? (
        "Loading..."
      ) : (
        <div className="definition">
          <Segments segments={segments} />
          <RunebergLink pageNo={pageNo} />
        </div>
      )}
    </Fragment>
  );
}
