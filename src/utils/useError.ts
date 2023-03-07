import { useState } from 'react';
import { CustomError } from '../types/CustomError';

export const useError = (init: CustomError) => {
  const [customError, setError]
    = useState(init);

  const setDelayError = (
    newError: CustomError,
    delay = 0,
  ) => {
    setError(newError);
    if (delay) {
      setTimeout(() => setError(CustomError.NoError), delay);
    }
  };

  return [customError, setDelayError] as const;
};
