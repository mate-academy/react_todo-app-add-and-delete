import { Errors } from '../types/Errors';

export const handleRequestError = (
  errorMessage: Errors,
  setError: (errorMessage: Errors) => void,
) => {
  setError(errorMessage);
  setTimeout(() => {
    setError(Errors.default);
  }, 3000);
};
