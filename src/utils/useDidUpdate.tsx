import React, { useEffect, useRef } from 'react';

export function useDidUpdateEffect(
  fn: () => void,
  inputs: React.DependencyList | undefined,
) {
  const didMountRef = useRef(false);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (didMountRef.current) {
      return fn();
    }

    didMountRef.current = true;
  }, inputs);
}
