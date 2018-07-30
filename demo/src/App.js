import React, { Component } from "react";
import { Map } from "react-tiled";

import "./App.css";

const MAP_PATH = process.env.PUBLIC_URL + "/assets/";

class App extends Component {
  state = {
    map: null
  };

  componentDidMount() {
    fetch(MAP_PATH + "map.json")
      .then(res => res.json())
      .then(map => this.setState({ map }))
      .catch(error => console.error(error));
  }

  render() {
    const { map } = this.state;

    return (
      <div className="App">
        <Map mapPath={MAP_PATH} map={map} />
      </div>
    );
  }
}

export default App;
