import { useEffect, useState } from 'react';
import { ERROR_MESSAGES, ErrorMessage } from '../types/error';

const useErrors = (duration = 3000) => {
  const [errorMessage, setErrorMessage] = useState(
    ERROR_MESSAGES[ErrorMessage.Null],
  );

  const showError = (errorMsg: ErrorMessage) => {
    setErrorMessage(ERROR_MESSAGES[errorMsg]);
  };

  const hideError = () => {
    setErrorMessage(ERROR_MESSAGES[ErrorMessage.Null]);
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(hideError, duration);

    return () => clearTimeout(timer);
  }, [errorMessage, duration]);

  return {
    errorMessage,
    showError,
    hideError,
  };
};

export default useErrors;
