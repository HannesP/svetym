import React, { Component } from "react";
import { Helmet } from "react-helmet";
import { Route } from "react-router-dom";

import Nav from "./Nav";
import BigSearch from "./BigSearch";
import SearchView from "./SearchView";
import EntryView from "./EntryView";
import About from "./About";

export default class Layout extends Component {
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
          <Route path="/entry/:word/:defNo" component={EntryView} />
          <Route path="/about" component={About} />
        </div>
      </div>
    );
  }
}
