import React, { Component, Fragment } from "react";
import { Helmet } from "react-helmet";
import Segments from './Segments';

const RunebergLink = ({ pageNo }) => {
  const str = String(pageNo);
  const pad = Array(4 - str.length)
    .fill("0")
    .join("");
  const href = `http://runeberg.org/svetym/${pad + str}.html`;
  return <a href={href}>ᚱ</a>;
};

export default class EntryView extends Component {
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
