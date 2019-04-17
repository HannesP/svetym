import React, { useState, useEffect, Fragment } from "react";
import queryString from "query-string";
import { Link, Redirect } from "react-router-dom";

import Segments from "./Segments";

const NotFound = ({ query }) => (
  <div className="alert alert-warning">No result for "{query}".</div>
);

function useSearchResult(query) {
  const [exact, setExact] = useState([]);
  const [partial, setPartial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function() {
      const res = await fetch(`/api/search/${query}`);
      const entries = res.ok ? await res.json() : { exact: [], partial: [] };
      const { exact, partial } = entries;

      setExact(exact);
      setPartial(partial);
      setIsLoading(false);
    })();
  }, [query]);

  return { exact, partial, isLoading };
}

export default function SearchView(props) {
  const query = queryString.parse(props.location.search).q || "";
  const { exact, partial, isLoading } = useSearchResult(query);

  if (isLoading) {
    return <span className="loading" />;
  }

  const notFound = exact.length + partial.length === 0;
  const foundBoth = exact.length * partial.length > 0;

  if (notFound) {
    return <NotFound query={query} />;
  }

  if (exact.length === 1 && partial.length === 0) {
    const entry = exact[0].entry;
    if (entry.toLowerCase() === query.toLowerCase()) {
      return <Redirect to={`/entry/${entry}/1`} />;
    }
  }

  const ResultList = ({ matches }) => (
    <Fragment>
      {matches.map(({ entry, defNo, preview: [segments, didCap] }, i) => (
        <p key={`${entry}_${defNo}`}>
          <Link to={`/entry/${entry}/${defNo}`}>
            <Segments segments={segments.slice(0, 10)} />
            {didCap ? " …" : ""}
          </Link>
        </p>
      ))}
    </Fragment>
  );

  return (
    <div>
      <p>
        Results for "{query}
        ":
      </p>
      <ResultList matches={exact} />
      {foundBoth && <hr />}
      <ResultList matches={partial} />
    </div>
  );
}
