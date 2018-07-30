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

export function getTileId(tileGid) {
  return (
    tileGid &
    ~(
      FLIPPED_HORIZONTALLY_FLAG |
      FLIPPED_VERTICALLY_FLAG |
      FLIPPED_DIAGONALLY_FLAG
    )
  );
}

export function getTileSet(tileSets, tileGid) {
  const tileId = getTileId(tileGid);

  return tileSets.find(
    tileSet =>
      tileId >= tileSet.firstgid &&
      tileId < tileSet.firstgid + tileSet.tilecount
  );
}

export function getTileBgPos(tileSet, tileGid) {
  const tileId = getTileId(tileGid);

  return {
    x: ((tileId - tileSet.firstgid) % tileSet.columns) * -tileSet.tilewidth,
    y:
      Math.floor((tileId - tileSet.firstgid) / tileSet.columns) *
      -tileSet.tileheight
  };
}

export function getTileAnimation(tileSet, tileGid) {
  if (!tileSet.tiles) return null;

  const tileId = getTileId(tileGid);
  const tileConfig = tileSet.tiles[tileId - tileSet.firstgid];

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

  return {
    transform: `scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`
  };
}
