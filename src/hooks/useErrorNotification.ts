import { useState, useCallback, useEffect } from 'react';

export const useErrorNotification = () => {
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = useCallback((message: string) => {
    setError(message);
    setIsVisible(true);
  }, []);

  const hideError = useCallback(() => {
    setIsVisible(false);
    setError(null);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const timer = setTimeout(() => {
      hideError();
    }, 3000);

    return () => clearTimeout(timer);
  }, [isVisible, hideError]);

  const hidden = !isVisible;

  return { error, isVisible, hidden, showError, hideError };
};
