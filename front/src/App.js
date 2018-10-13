import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";

import Layout from  './Layout';
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
  }
}
