import { ErrorMessages } from '../types/ErrorTypes';

export const handleError = (
  setErrorMessage: (errorType: ErrorMessages) => void,
  errorType: ErrorMessages,
) => {
  setErrorMessage(errorType);
  setTimeout(() => setErrorMessage(ErrorMessages.NONE), 3000);
};
