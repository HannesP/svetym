import React from "react";

export default function BigSearch() {
  return (
    <div className="BigSearch">
      <img
        width="50%"
        height="50%"
        className="elof mx-auto"
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
