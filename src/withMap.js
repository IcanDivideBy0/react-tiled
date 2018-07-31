import React from "react";
import hoistNonReactStatic from "hoist-non-react-statics";

import { MapConsumer } from "./Map";

/**
 * Consumer
 */

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withMap(WrappedComponent) {
  function WithMap(props, ref) {
    return (
      <MapConsumer>
        {map => <WrappedComponent map={map} ref={ref} {...props} />}
      </MapConsumer>
    );
  }
  WithMap.displayName = `withMap(${getDisplayName(WrappedComponent)})`;

  const Component = React.forwardRef(WithMap);
  return hoistNonReactStatic(
    props => <Component {...props} />,
    WrappedComponent
  );
}
