import React, { useEffect } from 'react';

type Props = {
  error: boolean;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
};

export const useToChangeTheTodo = ({ error, setError }: Props) => {
  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);
};
/* eslint-enable */
