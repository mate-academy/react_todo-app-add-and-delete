import { useCallback, useEffect, useState } from 'react';

export const useTimeout = (callback: () => void, delay: number) => {
  const [id, setId] = useState(0);
  const stop = useCallback(() => window.clearTimeout(id), [id]);
  const start = useCallback(
    () => setId(window.setTimeout(callback, delay)),
    [callback, delay],
  );

  useEffect(() => () => stop(), [stop]);

  return [start, stop];
};
