import React from "react";
import styled from "styled-components";

import { getLayerProperty } from "./utils";
import { withMap } from "./MapProvider";
import Tile from "./Tile";
import LayerObject from "./LayerObject";

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

class Layer extends React.PureComponent {
  renderTileLayerData(data, width, offset, zAuto) {
    const { map } = this.props;

    return data.map(
      (tileGid, idx) =>
        !!tileGid && (
          <Tile
            key={idx}
            tileGid={tileGid}
            pos={{
              x: offset.x + (idx % width) * map.tilewidth,
              y: offset.y + Math.floor(idx / width) * map.tileheight
            }}
            zAuto={zAuto}
          />
        )
    );
  }

  renderTileLayer(layer) {
    const { map } = this.props;

    const layerOffset = {
      x: (layer.x + layer.startx) * map.tilewidth + (layer.offsetx || 0),
      y: (layer.y + layer.starty) * map.tileheight + (layer.offsety || 0)
    };

    const zAuto = getLayerProperty(layer, "zAuto");

    return (
      <React.Fragment>
        {!!layer.data &&
          this.renderTileLayerData(layer.data, layer.width, layerOffset, zAuto)}

        {!!layer.chunks &&
          layer.chunks.map((chunk, idx) => {
            const chunkOffset = {
              x: layerOffset.x + (chunk.x - layer.startx) * map.tilewidth,
              y: layerOffset.y + (chunk.y - layer.starty) * map.tileheight
            };

            return (
              <React.Fragment key={idx}>
                {this.renderTileLayerData(
                  chunk.data,
                  chunk.width,
                  chunkOffset,
                  zAuto
                )}
              </React.Fragment>
            );
          })}
      </React.Fragment>
    );
  }

  renderObjectGroupLayer(layer) {
    const { map } = this.props;

    return (
      <GroupLayerWrapper
        style={{
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
    const { layer, debug } = this.props;

    if (!layer.visible) return null;
    if (getLayerProperty(layer, "debugOnly", false) && !debug) return null;

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

export default withMap(Layer);
