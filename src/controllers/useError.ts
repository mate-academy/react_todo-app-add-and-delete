import { useCallback, useState } from 'react';

type HookOutput = [
  (message: string) => void,
  (message: string) => void,
  string[],
];

export const useError = (): HookOutput => {
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const closeErroreMessage = useCallback((message: string) => {
    setErrorMessages((prev) => {
      const messageIndex = prev.indexOf(message);
      const messagesCopy = [...prev];

      messagesCopy.splice(messageIndex, 1);

      return messagesCopy;
    });
  }, []);

  const showError = useCallback((message: string) => {
    setErrorMessages((prev) => [message, ...prev]);

    setTimeout(() => closeErroreMessage(message), 3000);
  }, [closeErroreMessage]);

  return [showError, closeErroreMessage, errorMessages];
};
