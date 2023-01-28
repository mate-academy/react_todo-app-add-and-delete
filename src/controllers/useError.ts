import { useCallback, useState } from 'react';

type HookOutput = [
  (messages:string) => void,
  (messages:string) => void,
  string[],
];

export const useError = (): HookOutput => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const closeError = useCallback((message: string) => {
    setErrorMessages((prev: string[]) => {
      const messageIndex = prev.indexOf(message);
      const messagesCopy = [...prev];

      messagesCopy.splice(messageIndex, 1);

      return messagesCopy;
    });
  }, []);

  const showError = useCallback((message: string) => {
    setErrorMessages((prev) => [message, ...prev]);

    setTimeout(() => closeError(message), 3000);
  }, [closeError]);

  return [showError, closeError, errorMessages];
};
