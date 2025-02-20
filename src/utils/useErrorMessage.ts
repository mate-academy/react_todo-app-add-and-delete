import { useRef, useState } from 'react';
type SetErrorMessage = (mess: string) => void;

export function useErrorMessage(initialString: string) {
  const [message, setMessage] = useState(initialString);
  const timerForErrMessage = useRef(0);

  const setErrorMessage: SetErrorMessage = errorMessage => {
    clearTimeout(timerForErrMessage.current);
    setMessage(errorMessage);
    timerForErrMessage.current = window.setTimeout(() => setMessage(''), 3000);
  };

  return [message, setErrorMessage] as const;
}
