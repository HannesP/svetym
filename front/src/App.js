import React from "react";
import { BrowserRouter } from "react-router-dom";

import Layout from "./Layout";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}
