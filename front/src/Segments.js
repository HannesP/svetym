import React, { Component, Fragment } from "react";

export default class Segments extends Component {
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
