import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { mapPropType } from "./propTypes";
import Tile from "./Tile";
import LayerObject from "./LayerObject";

const TileLayerWrapper = styled.div`
  position: absolute;
  width: calc(var(--layer-width) * var(--tile-width) * 1px);
  height: calc(var(--layer-height) * var(--tile-height) * 1px);
  top: calc(
    ((var(--layer-y)) * var(--tile-height) + var(--layer-offset-y)) * 1px
  );
  left: calc(
    ((var(--layer-x)) * var(--tile-width) + var(--layer-offset-x)) * 1px
  );
  opacity: var(--layer-opacity);
`;

const TileLayerChunkWrapper = styled.div`
  position: absolute;
  width: calc(var(--chunk-width) * var(--tile-width) * 1px);
  height: calc(var(--chunk-height) * var(--tile-height) * 1px);
  top: calc(((var(--chunk-y)) * var(--tile-height)) * 1px);
  left: calc(((var(--chunk-x)) * var(--tile-width)) * 1px);
`;

const GroupLayerWrapper = styled.div`
  position: absolute;
  top: calc(
    ((var(--layer-y)) * var(--tile-height) + var(--layer-offset-y)) * 1px
  );
  left: calc(
    ((var(--layer-x)) * var(--tile-width) + var(--layer-offset-x)) * 1px
  );
  opacity: var(--layer-opacity);
`;

export default class Layer extends React.PureComponent {
  static propTypes = {
    map: mapPropType,
    mapPath: PropTypes.string.isRequired
  };

  renderTileLayerData(data, width) {
    const { map, mapPath } = this.props;

    return data.map(
      (tileGid, idx) =>
        !!tileGid && (
          <Tile
            key={idx}
            map={map}
            mapPath={mapPath}
            tileGid={tileGid}
            pos={{
              x: idx % width,
              y: Math.floor(idx / width)
            }}
          />
        )
    );
  }

  renderTileLayer(layer) {
    const { map } = this.props;

    return (
      <TileLayerWrapper
        className="tiled-layer"
        style={{
          "--tile-width": map.tilewidth,
          "--tile-height": map.tileheight,
          "--layer-width": layer.width,
          "--layer-height": layer.height,
          "--layer-x": layer.x + layer.startx,
          "--layer-y": layer.y + layer.starty,
          "--layer-offset-x": layer.offsetx || 0,
          "--layer-offset-y": layer.offsety || 0,
          "--layer-opacity": layer.opacity,
          "--foo": layer.starty
        }}
      >
        {!!layer.data && this.renderTileLayerData(layer.data, layer.width)}

        {!!layer.chunks &&
          layer.chunks.map((chunk, idx) => (
            <TileLayerChunkWrapper
              key={idx}
              className="tiled-layer-chunk"
              style={{
                "--chunk-width": chunk.width,
                "--chunk-height": chunk.height,
                "--chunk-x": chunk.x - layer.startx,
                "--chunk-y": chunk.y - layer.starty
              }}
            >
              {this.renderTileLayerData(chunk.data, chunk.width)}
            </TileLayerChunkWrapper>
          ))}
      </TileLayerWrapper>
    );
  }

  renderObjectGroupLayer(layer) {
    const { map, mapPath } = this.props;

    return (
      <GroupLayerWrapper
        style={{
          "--tile-width": map.tilewidth,
          "--tile-height": map.tileheight,
          "--layer-x": layer.x,
          "--layer-y": layer.y,
          "--layer-offset-x": layer.offsetx || 0,
          "--layer-offset-y": layer.offsety || 0,
          "--layer-opacity": layer.opacity
        }}
      >
        {layer.objects.map((object, idx) => (
          <LayerObject
            key={idx}
            map={map}
            mapPath={mapPath}
            layerColor={layer.color}
            object={object}
          />
        ))}
      </GroupLayerWrapper>
    );
  }

  renderGroupLayer(layer) {
    const { map } = this.props;

    return (
      <GroupLayerWrapper
        style={{
          "--tile-width": map.tilewidth,
          "--tile-height": map.tileheight,
          "--layer-x": layer.x,
          "--layer-y": layer.y,
          "--layer-offset-x": layer.offsetx || 0,
          "--layer-offset-y": layer.offsety || 0,
          "--layer-opacity": layer.opacity
        }}
      >
        {layer.layers.map((_layer, idx) => (
          <Layer key={idx} map={map} layer={_layer} />
        ))}
      </GroupLayerWrapper>
    );
  }

  render() {
    const { layer } = this.props;

    if (!layer.visible) return null;

    if (layer.encoding) {
      console.error(
        "[react-tiled] Only CSV layer encoding is supported for now."
      );
      return null;
    }

    switch (layer.type) {
      case "tilelayer":
        return this.renderTileLayer(layer);

      case "objectgroup":
        return this.renderObjectGroupLayer(layer);

      case "group":
        return this.renderGroupLayer(layer);

      default:
        return null;
    }
  }
}
