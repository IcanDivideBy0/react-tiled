import React, { Component } from "react";
import { MapLoader, Map } from "react-tiled";
import styled from "styled-components";

const AppWrapper = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #1c1117;
`;

class App extends Component {
  render() {
    return (
      <MapLoader mapUrl={process.env.PUBLIC_URL + "/assets/map.json"}>
        <AppWrapper>
          <Map style={{ transform: "scale(2)" }} />
        </AppWrapper>
      </MapLoader>
    );
  }
}

export default App;
