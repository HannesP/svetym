import React, { Fragment } from "react";

function segmentToComponent([type, value], key) {
  if (type === "_t") {
    return <span key={key}>{value}</span>;
  }

  return React.createElement(type, { key }, value);
}

export default function Segments(props) {
  return (
    <Fragment>
      {props.segments.map((segment, segNo) =>
        segmentToComponent(segment, segNo)
      )}
    </Fragment>
  );
}
