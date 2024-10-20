import { Errors } from '../types/Errors';
import { Dispatch, SetStateAction } from 'react';

export const handleError = (
  setError: Dispatch<SetStateAction<Errors>>,
  error: Errors,
) => {
  setError(error);
  setTimeout(() => {
    setError(Errors.Default);
  }, 3000);
};
