import React, { Component } from "react";
import { MapLoader, Map } from "react-tiled";

import "./App.css";

const MAP_URL = process.env.PUBLIC_URL + "/assets/map.json";

class App extends Component {
  render() {
    return (
      <MapLoader mapUrl={MAP_URL}>
        <Map />
      </MapLoader>
    );
  }
}

export default App;
