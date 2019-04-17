import React from "react";
import { Helmet } from "react-helmet";
import { Route } from "react-router-dom";

import Nav from "./Nav";
import BigSearch from "./BigSearch";
import SearchView from "./SearchView";
import EntryView from "./EntryView";
import About from "./About";

export default function Layout() {
  const title = "Svensk etymologisk ordbok";
  return (
    <div className="App">
      <Helmet defaultTitle={title} titleTemplate={"%s – " + title} />
      <Route
        path="/"
        render={({ location }) => (
          <Nav showSearch={location.pathname !== "/"} />
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
