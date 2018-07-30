import PropTypes from "prop-types";

export const layerPropType = PropTypes.shape({
  name: PropTypes.string.isRequired
  // height: PropTypes.number.isRequired,
  // width: PropTypes.number.isRequired,
  // x: PropTypes.number.isRequired,
  // y: PropTypes.number.isRequired
});

export const tileSetPropType = PropTypes.shape({});

export const mapPropType = PropTypes.shape({
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  tileheight: PropTypes.number.isRequired,
  tilewidth: PropTypes.number.isRequired,
  layers: PropTypes.arrayOf(layerPropType),
  tilesets: PropTypes.arrayOf(tileSetPropType)
});
