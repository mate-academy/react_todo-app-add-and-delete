import { Dispatch, SetStateAction } from 'react';

export const showError = (
  errorText : string, setError: Dispatch<SetStateAction<string>>,
) => {
  setError(errorText);
  setTimeout(() => setError(''), 3000);
};
