import { Errors } from '../types/Errors';

export const handleError = (
  error: Errors,
  setError: (error: Errors) => void,
) => {
  setError(error);

  setTimeout(() => {
    setError(Errors.DEFAULT);
  }, 3000);
};
