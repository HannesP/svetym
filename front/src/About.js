import React from "react";

function emailAddress() {
  return "inXXXXetym.se".replace("XXXX", "fo@sv");
}

function About() {
  return (
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
}

export default About;
