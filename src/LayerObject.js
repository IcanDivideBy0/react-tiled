import React from "react";
import styled from "styled-components";

import { convertTiledColor, getTileSet } from "./utils";
import { withMap } from "./MapProvider";
import Tile from "./Tile";

const LayerObjectWrapper = styled.div`
  position: absolute;
  top: calc(var(--object-pos-y) * 1px);
  left: calc(var(--object-pos-x) * 1px);
  width: calc(var(--object-width) * 1px);
  height: calc(var(--object-height) * 1px);

  /* Text styles */
  display: flex;
  flex-direction: row;
  align-items: var(--object-align-items);
  justify-content: var(--object-justify-content);
  text-align: var(--object-text-align);
  color: var(--object-text-color);
  font-family: var(--object-text-font-family);
  font-size: calc(var(--object-text-font-size) * 1px);
  font-weight: var(--object-text-font-weight);
  font-style: var(--object-text-font-style);
  text-decoration: var(--object-text-text-decoration);
`;

class LayerObject extends React.PureComponent {
  render() {
    const { map, layerColor, object } = this.props;

    if (!object.visible) return null;

    const style = {
      "--object-width": object.width,
      "--object-height": object.height,
      "--object-pos-x": object.x,
      "--object-pos-y": object.y,
      transform: `rotate(${object.rotation}deg)`,
      transformOrigin: "top left"
    };

    if (object.text) {
      Object.assign(style, {
        "--object-align-items":
          object.text.valign === "bottom"
            ? "flex-end"
            : object.text.halign === "center"
              ? "center"
              : "flex-start",
        "--object-justify-content":
          object.text.halign === "right"
            ? "flex-end"
            : object.text.halign === "center"
              ? "center"
              : object.text.halign === "justify"
                ? "stretch"
                : "flex-start",
        "--object-text-align":
          object.text.halign === "right"
            ? "right"
            : object.text.halign === "center"
              ? "center"
              : object.text.halign === "justify"
                ? "justify"
                : "left",
        "--object-text-color": convertTiledColor(object.text.color),
        "--object-text-font-family": `"${object.text.fontfamily}"`,
        "--object-text-font-size": object.text.pixelsize || 16,
        "--object-text-font-weight": object.text.bold ? 700 : 400,
        "--object-text-font-style": object.text.italic ? "italic" : "normal",
        "--object-text-text-decoration": [
          object.text.underline && "underline",
          object.text.strikeout && "line-through"
        ]
          .filter(v => !!v)
          .join(" ")
      });
    } else if (!!object.gid) {
      const tileSet = getTileSet(map.tilesets, object.gid);

      Object.assign(style, {
        "--object-width": tileSet.tilewidth,
        "--object-height": tileSet.tileheight,
        transform: `
          translate(0, -100%)
          rotate(${object.rotation}deg)
          scale(
            ${object.width / tileSet.tilewidth},
            ${object.height / tileSet.tileheight}
          )
          `,
        transformOrigin: "bottom left"
      });
    } else {
      Object.assign(style, {
        backgroundColor: layerColor && convertTiledColor(layerColor)
      });
    }

    return (
      <LayerObjectWrapper style={style}>
        {!!object.text && object.text.text}

        {!!object.gid && <Tile tileGid={object.gid} pos={{ x: 0, y: 0 }} />}
      </LayerObjectWrapper>
    );
  }
}

export default withMap(LayerObject);
