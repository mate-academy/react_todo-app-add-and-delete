import { ErrorMessage } from '../enum/ErrorMessages';

export const setErrorWithTimeout = (
  type: ErrorMessage | null,
  time: number,
  setErrorMessage: (type: ErrorMessage | null) => void,
) => {
  setErrorMessage(type);

  setTimeout(() => {
    setErrorMessage(null);
  }, time);
};
