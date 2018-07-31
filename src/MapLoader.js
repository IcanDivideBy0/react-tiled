import React from "react";
import PropTypes from "prop-types";
import hoistNonReactStatic from "hoist-non-react-statics";

const { Provider, Consumer } = React.createContext();

/**
 * Provider
 */

export default class MapLoader extends React.Component {
  static propTypes = {
    mapUrl: PropTypes.string.isRequired
  };

  state = {
    value: null
  };

  componentDidMount() {
    const { mapUrl } = this.props;
    const [, mapPath] = mapUrl.match(/^(.*\/)([^/]*)$/);

    fetch(mapUrl)
      .then(res => res.json())
      .then(map => {
        this.setState({
          value: {
            map: map,
            mapPath
          }
        });
      })
      .catch(err => console.error(err));
  }

  render() {
    const { value } = this.state;
    if (!value) return null;

    return <Provider value={value} {...this.props} />;
  }
}

/**
 * Consumer
 */

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export function withMap(WrappedComponent) {
  function WithMap(props, ref) {
    return (
      <Consumer>
        {value => (
          <WrappedComponent
            map={value.map}
            mapPath={value.mapPath}
            ref={ref}
            {...props}
          />
        )}
      </Consumer>
    );
  }
  WithMap.displayName = `withMap(${getDisplayName(WrappedComponent)})`;

  const Component = React.forwardRef(WithMap);
  return hoistNonReactStatic(
    props => <Component {...props} />,
    WrappedComponent
  );
}
