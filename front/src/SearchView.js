import React, { Component, Fragment } from "react";
import queryString from "query-string";
import { Link, Redirect } from "react-router-dom";

import Segments from './Segments';

const NotFound = ({ query }) => (
  <div className="alert alert-warning">
    No result for "{query}
    ".
  </div>
);

export default class SearchView extends Component {
  constructor(props) {
    super(props);
    this.state = { exact: [], partial: [], hasReceived: false };
  }

  parseQuery(props) {
    const theProps = props || this.props;
    return queryString.parse(theProps.location.search).q;
  }

  searchEntries(query) {
    return fetch(`/api/search/${query}`)
      .then(res => (res.ok ? res.json() : []))
      .then(({ exact, partial }) => {
        this.setState({ exact, partial, hasReceived: true });
      });
  }

  componentDidMount() {
    this.searchEntries(this.parseQuery());
  }

  componentDidUpdate(nextProps) {
    const oldQuery = this.parseQuery();
    const newQuery = this.parseQuery(nextProps);
    if (oldQuery !== newQuery) {
      this.searchEntries(newQuery);
    }
  }

  render() {
    const { exact, partial, hasReceived } = this.state;

    if (!hasReceived) {
      return <span className="loading" />;
    }

    const query = this.parseQuery();
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
}
