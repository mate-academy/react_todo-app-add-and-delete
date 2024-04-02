import { Errors } from '../enums/Errors';

export const getErrors = (
  errorMessage: Errors | null,
  setErrorMessage: (errorMessage: Errors | null) => void,
) => {
  setErrorMessage(errorMessage);
  setTimeout(() => {
    setErrorMessage(null);
  }, 3000);
};
