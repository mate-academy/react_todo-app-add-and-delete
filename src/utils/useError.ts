import { useState } from 'react';
import { CustomError } from '../types/CustomError';

export const useError = (init: CustomError) => {
  const [customError, setError]
    = useState<CustomError>(init);

  const setDelayError = (
    newError: CustomError,
    delay = 0,
  ) => {
    setError(newError);
    if (delay) {
      setTimeout(() => setError(CustomError.noError), delay);
    }
  };

  return [customError, setDelayError] as const;
};
