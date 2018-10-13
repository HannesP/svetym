import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter, Route, Link } from "react-router-dom";
import queryString from "query-string";

import "./App.css";
import Redirect from "react-router-dom/Redirect";

class Nav extends Component {
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <Link to="/" className="navbar-brand">
          Svetym
        </Link>
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About
            </Link>
          </li>
        </ul>
        {this.props.showSearch && (
          <form action="/search" className="form-inline">
            <input
              className="form-control mr-sm-2"
              placeholder="Search…"
              type="search"
              name="q"
              autoComplete="off"
            />
          </form>
        )}
      </nav>
    );
  }
}

class BigSearch extends Component {
  render() {
    return (
      <div className="BigSearch">
        <img
          width="50%"
          height="50%"
          className="mx-auto"
          alt="Elof Hellquist"
          title="Elof Hellquist, 1864–1933"
          src="/elof.png"
        />
        <h1>Svensk etymologisk ordbok</h1>
        <h2>by Elof Hellquist, 1922</h2>
        <form action="search">
          <input
            className="form-control"
            name="q"
            type="search"
            placeholder="Look up a word…"
            autoFocus={true}
            autoComplete="off"
          />
        </form>
      </div>
    );
  }
}

class Segments extends Component {
  segmentToComponent([type, value], key) {
    if (type === "_t") {
      return <span key={key}>{value}</span>;
    }

    return React.createElement(type, { key }, value);
  }

  render() {
    return (
      <Fragment>
        {this.props.segments.map((segment, segNo) =>
          this.segmentToComponent(segment, segNo)
        )}
      </Fragment>
    );
  }
}

class SearchView extends Component {
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

    if (notFound === 0) {
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

class EntryView extends Component {
  constructor(props) {
    super(props);
    this.state = { entry: null, hasReceived: false };
  }

  parseQuery(props) {
    const { entry, defNo } = (props || this.props).match.params;
    return [entry, defNo];
  }

  fetchEntries([entry, defNo]) {
    return fetch(`/api/entry/${entry}/${defNo}`)
      .then(res => (res.ok ? res.json() : null))
      .then(entry => this.setState({ entry, hasReceived: false }));
  }

  componentDidMount() {
    this.fetchEntries(this.parseQuery());
  }

  componentDidUpdate(nextProps) {
    const oldQuery = this.parseQuery();
    const newQuery = this.parseQuery(nextProps);
    if (oldQuery.join("/") !== newQuery.join("/")) {
      this.fetchEntries(newQuery);
    }
  }

  segmentToComponent([type, value], key) {
    if (type === "_t") {
      return <span key={key}>{value}</span>;
    }

    return React.createElement(type, { key }, value);
  }

  render() {
    const entry = this.state.entry;
    if (entry == null) {
      return null;
    }

    const [pageNo, segments] = entry;
    const query = this.parseQuery();

    return (
      <Fragment>
        <Helmet>
          <title>{query[0]}</title>
        </Helmet>
        <div className="definition">
          <Segments segments={segments} />
          <RunebergLink pageNo={pageNo} />
        </div>
      </Fragment>
    );
  }
}

const RunebergLink = ({ pageNo }) => {
  const str = String(pageNo);
  const pad = Array(4 - str.length)
    .fill("0")
    .join("");
  const href = `http://runeberg.org/svetym/${pad + str}.html`;
  return <a href={href}>ᚱ</a>;
};

const NotFound = ({ query }) => (
  <div className="alert alert-warning">
    No result for "{query}
    ".
  </div>
);

function emailAddress() {
  return "inXXXXetym.se".replace("XXXX", "fo@sv");
}

const About = () => (
  <div>
    <p>
      This is an index of <cite>Svensk etymologisk ordbok</cite> by Elof
      Hellquist, published in 1922. The digitalisation of the work was carried
      out by <a href="http://runeberg.org/svetym/">Projekt Runeberg</a>; this
      site is just a convenience for accessing it.
    </p>
    <p>
      Contact: <a href={"mailto:" + emailAddress()}>{emailAddress()}</a>
    </p>
    <p>
      GitHub:{" "}
      <a href="https://github.com/HannesP/svetym">
        https://github.com/HannesP/svetym
      </a>
    </p>
  </div>
);

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      definitions: [],
      hasSearched: false,
      notFound: false,
      pageNo: undefined
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  recordResult(definitions, wasFound) {
    this.setState({
      definitions,
      hasSearched: true,
      notFound: !wasFound
    });
  }

  handleSubmit(query) {
    this.setState({
      submittedQuery: query,
      hasSearched: true
    });
    fetch(`/api/entry/${query}`)
      .then(res => res.json())
      .then(definitions => this.recordResult(definitions, true))
      .catch(err => this.recordResult([], false));
  }

  render() {
    const title = "Svensk etymologisk ordbok";
    return (
      <div className="App">
        <Helmet defaultTitle={title} titleTemplate={"%s – " + title} />
        <Route
          path="/"
          render={({ location }) => (
            <Nav
              showSearch={location.pathname !== "/"}
              onQuery={this.handleSubmit}
            />
          )}
        />
        <div className="container">
          <Route path="/" exact component={BigSearch} />
          <Route path="/search" component={SearchView} />
          <Route path="/entry/:entry/:defNo" component={EntryView} />
          <Route path="/about" component={About} />
        </div>
      </div>
    );
  }
}

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
  }
}
