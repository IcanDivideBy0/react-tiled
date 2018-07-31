import React from "react";
import styled from "styled-components";

import { withMap } from "./MapProvider";
import Layer from "./Layer";

const MapWrapper = styled.div`
  position: relative;
  width: calc(var(--map-width) * var(--tile-width) * 1px);
  height: calc(var(--map-height) * var(--tile-height) * 1px);
  background-color: var(--map-bg-color);

  image-rendering: optimizeSpeed;
  image-rendering: -moz-crisp-edges;
  image-rendering: -o-crisp-edges;
  image-rendering: -webkit-optimize-contrast;
  image-rendering: pixelated;
  image-rendering: optimize-contrast;
  -ms-interpolation-mode: nearest-neighbor;
`;

class Map extends React.PureComponent {
  state = {
    map: null,
    error: null
  };

  render() {
    const { map, style, children } = this.props;

    return (
      <MapWrapper
        className="tiled-map"
        style={{
          "--map-width": map.width,
          "--map-height": map.height,
          "--map-bg-color": map.backgroundcolor || "rgba(0, 0, 0, 0)",
          "--tile-width": map.tilewidth,
          "--tile-height": map.tileheight,

          ...style
        }}
      >
        {map.layers.map((layer, idx) => (
          <Layer key={idx} layer={layer} />
        ))}

        {children}
      </MapWrapper>
    );
  }
}

export default withMap(Map);
