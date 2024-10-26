import { useEffect, Dispatch } from 'react';

export const useDelayedSetState = <T>(
  state: T | null,
  setState: Dispatch<React.SetStateAction<T | null>>,
  value: T | null = null,
  delay: number = 3000,
): void => {
  return useEffect(() => {
    if (state) {
      setTimeout(() => {
        setState(value);
      }, delay);
    }
  }, [state]);
};
