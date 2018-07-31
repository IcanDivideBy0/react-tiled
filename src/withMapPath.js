import React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";

import { MapPathConsumer } from "./Map";

/**
 * Consumer
 */

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withMapPath(WrappedComponent) {
  function WithMapPath(props, ref) {
    return (
      <MapPathConsumer>
        {mapPath => <WrappedComponent mapPath={mapPath} ref={ref} {...props} />}
      </MapPathConsumer>
    );
  }
  WithMapPath.displayName = `withMapPath(${getDisplayName(WrappedComponent)})`;

  const Component = React.forwardRef(WithMapPath);
  return hoistNonReactStatic(
    props => <Component {...props} />,
    WrappedComponent
  );
}
