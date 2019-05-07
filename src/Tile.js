import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { withMap } from "./MapProvider";

import {
  getTileSet,
  getTileBgPos,
  getTileProperty,
  getTileAnimationJss,
  getTileTransformJss
} from "./utils";

const TileWrapper = styled.div`
  background-image: var(--tileset-image);
  background-repeat: no-repeat;
  position: absolute;
`;

class Tile extends React.PureComponent {
  static propTypes = {
    tileGid: PropTypes.number.isRequired,
    pos: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }).isRequired,
    zAuto: PropTypes.bool
  };

  render() {
    const { map, mapPath, tileGid, pos, zAuto } = this.props;

    const tileSet = getTileSet(map.tilesets, tileGid);
    if (!tileSet) return null;

    const bgPos = getTileBgPos(tileSet, tileGid);

    const zIndex =
      zAuto || getTileProperty(tileSet, tileGid, "zAuto")
        ? pos.y + tileSet.tileheight
        : "initial";

    return (
      <TileWrapper
        className="tiled-tile"
        style={{
          "--tileset-image": `url(${encodeURI(mapPath)}/${encodeURI(tileSet.image)})`,
          backgroundPosition: `${bgPos.x}px ${bgPos.y}px`,
          width: tileSet.tilewidth,
          height: tileSet.tileheight,
          top: pos.y,
          left: pos.x,
          zIndex,

          ...getTileAnimationJss(tileSet, tileGid),
          ...getTileTransformJss(tileSet, tileGid)
        }}
      />
    );
  }
}

export default withMap(Tile);
