import { Dispatch, SetStateAction } from 'react';

export const showError = (
  setErrorMessage: Dispatch<SetStateAction<string>>,
  message: string,
) => {
  setErrorMessage(message);
  setTimeout(() => setErrorMessage(''), 3000);
};
