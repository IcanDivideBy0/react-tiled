import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { mapPropType } from "./propTypes";
import {
  getTileSet,
  getTileBgPos,
  getTileAnimation,
  getTileTransform
} from "./utils";

const TileWrapper = styled.div`
  background-image: var(--tile-image);
  background-position: calc(var(--bg-pos-x) * 1px) calc(var(--bg-pos-y) * 1px);
  background-repeat: no-repeat;
  width: calc(var(--tile-width) * 1px);
  height: calc(var(--tile-height) * 1px);

  position: absolute;
  top: calc(var(--pos-y) * var(--tile-height) * 1px);
  left: calc(var(--pos-x) * var(--tile-width) * 1px);
`;

export default class Tile extends React.PureComponent {
  static propTypes = {
    map: mapPropType.isRequired,
    mapPath: PropTypes.string.isRequired,
    tileGid: PropTypes.number.isRequired,
    pos: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired
  };

  render() {
    const { map, mapPath, tileGid, pos } = this.props;

    const tileSet = getTileSet(map.tilesets, tileGid);
    if (!tileSet) return null;

    const bgPos = getTileBgPos(tileSet, tileGid);

    return (
      <TileWrapper
        className="tiled-tile"
        style={{
          "--tile-width": tileSet.tilewidth,
          "--tile-height": tileSet.tileheight,
          "--tile-image": `url(${mapPath}/${tileSet.image})`,
          "--bg-pos-x": bgPos.x,
          "--bg-pos-y": bgPos.y,
          "--pos-x": pos.x,
          "--pos-y": pos.y,

          ...getTileAnimation(tileSet, tileGid),
          ...getTileTransform(tileSet, tileGid)
        }}
      />
    );
  }
}
