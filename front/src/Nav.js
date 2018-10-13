import React, { Component } from "react";
import { Link } from "react-router-dom";

export default class Nav extends Component {
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
