import { keyframes } from "styled-components";

export const FLIPPED_HORIZONTALLY_FLAG = 0x80000000;
export const FLIPPED_VERTICALLY_FLAG = 0x40000000;
export const FLIPPED_DIAGONALLY_FLAG = 0x20000000;

export function convertTiledColor(tiledColor, alpha = 1) {
  let [a, r, g, b] = tiledColor.match(/([0-9]|[a-f]){1,2}/gi);
  if (!b) [r, g, b, a] = [a, r, g, "ff"];

  [r, g, b, a] = [r, g, b, a].map(v => parseInt(v, 16));

  return `rgba(${r}, ${g}, ${b}, ${(a / 255) * alpha})`;
}

export function cleanTileGid(tileGid) {
  return (
    tileGid &
    ~(
      FLIPPED_HORIZONTALLY_FLAG |
      FLIPPED_VERTICALLY_FLAG |
      FLIPPED_DIAGONALLY_FLAG
    )
  );
}

export function getTileId(tileSet, tileGid) {
  const cleanedTileGid = cleanTileGid(tileGid);
  return cleanedTileGid - tileSet.firstgid;
}

export function getTileConfig(tileSet, tileGid) {
  if (!tileSet.tiles) return null;

  const tileId = getTileId(tileSet, tileGid);
  return tileSet.tiles[tileId];
}

export function getTileBgPos(tileSet, tileGid) {
  const tileId = getTileId(tileSet, tileGid);

  return {
    x: (tileId % tileSet.columns) * -tileSet.tilewidth,
    y: Math.floor(tileId / tileSet.columns) * -tileSet.tileheight
  };
}

export function getTileProperties(tileSet, tileGid) {
  const tileId = getTileId(tileSet, tileGid);
  const tilesProperties = tileSet.tileproperties || {};
  return tilesProperties[tileId] || {};
}

export function getTileProperty(tileSet, tileGid, propertyName, defaultValue) {
  const properties = getTileProperties(tileSet, tileGid);
  return propertyName in properties ? properties[propertyName] : defaultValue;
}

export function getTileAnimationJss(tileSet, tileGid) {
  const tileConfig = getTileConfig(tileSet, tileGid);

  if (!tileConfig) return null;
  if (!tileConfig.animation) return null;

  const duration = tileConfig.animation.reduce(
    (acc, frame) => acc + frame.duration,
    0
  );

  const style = {
    animationTimingFunction: "steps(1)",
    animationIterationCount: "infinite",
    animationDuration: `${duration}ms`
  };

  const frames = tileConfig.animation.reduce(
    (acc, frame) => {
      const elapsedTime = acc.elapsedTime + frame.duration;
      const framePercent = (100 * acc.elapsedTime) / duration;
      const bgPos = getTileBgPos(tileSet, frame.tileid + tileSet.firstgid);

      return {
        elapsedTime,
        result:
          acc.result +
          `
            ${framePercent}% {
              background-position: ${bgPos.x}px ${bgPos.y}px
            }
          `
      };
    },
    { elapsedTime: 0, result: "" }
  ).result;

  style.animationName = keyframes`
    ${frames}
  `;

  return style;
}

export function getTileTransform(tileSet, tileGid) {
  let scaleX = 1;
  let scaleY = 1;
  let rotate = 0;

  if (tileGid & FLIPPED_HORIZONTALLY_FLAG) scaleX = -1;
  if (tileGid & FLIPPED_VERTICALLY_FLAG) scaleY = -1;
  if (tileGid & FLIPPED_DIAGONALLY_FLAG) {
    scaleY = ~scaleY + 1;
    rotate = -90;
  }

  return { scaleX, scaleY, rotate };
}

export function getTileTransformJss(tileSet, tileGid) {
  const { scaleX, scaleY, rotate } = getTileTransform(tileSet, tileGid);
  return { transform: `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)` };
}

export function getLayerProperties(layer) {
  return layer.properties || {};
}

export function getLayerProperty(layer, propertyName, defaultValue) {
  const properties = getLayerProperties(layer);
  return propertyName in properties ? properties[propertyName] : defaultValue;
}

export function getTileSet(tileSets, tileGid) {
  const cleanedTileGid = cleanTileGid(tileGid);

  return tileSets.find(
    tileSet =>
      cleanedTileGid >= tileSet.firstgid &&
      cleanedTileGid < tileSet.firstgid + tileSet.tilecount
  );
}

export function getTileSetByName(tileSets, tileSetName) {
  return tileSets.find(tileSet => tileSet.name === tileSetName);
}

export function getTileGid(tileSets, tileSetName, tileId) {
  const tileSet = getTileSetByName(tileSets, tileSetName);
  return !tileSet ? 0 : tileId + tileSet.firstgid;
}
