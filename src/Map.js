import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { mapPropType } from "./propTypes";
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

export default class Map extends React.PureComponent {
  static propTypes = {
    map: mapPropType,
    mapPath: PropTypes.string.isRequired
  };

  state = {
    map: null,
    error: null
  };

  render() {
    const { map, mapPath, style, children } = this.props;

    if (!map) return null;

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
          <Layer key={idx} map={map} mapPath={mapPath} layer={layer} />
        ))}

        {children}
      </MapWrapper>
    );
  }
}
