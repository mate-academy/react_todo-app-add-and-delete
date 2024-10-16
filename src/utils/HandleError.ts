import { ErrorMessages } from '../types/ErrorMessages';
import { Dispatch, SetStateAction } from 'react';

export const handleError = (
  setError: Dispatch<SetStateAction<ErrorMessages>>,
  error: ErrorMessages,
) => {
  setError(error);

  setTimeout(() => {
    setError(ErrorMessages.None);
  }, 3000);
};
