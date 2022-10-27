import { useState } from 'react';

export const useError = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const clearError = () => {
    setErrorMessage(null);
  };

  const setError = (message: string): void => {
    setErrorMessage(message);

    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  return [errorMessage, setError, clearError] as const;
};

export const useFilter = () => {
  const [filter, setFilter] = useState<null | boolean>(null);

  const filterAll = () => setFilter(null);
  const filterActive = () => setFilter(false);
  const filterCompleted = () => setFilter(true);

  return [filter, filterAll, filterActive, filterCompleted] as const;
};

export const useLoader = () => {
  const [isLoading, setIsLoading] = useState<number[]>([]);

  const addToLoading = (todoId: number) => {
    setIsLoading([...isLoading, todoId]);
  };

  const removeFromLoading = (todoId: number) => {
    setIsLoading(isLoading.filter(el => el !== todoId));
  };

  return [isLoading, addToLoading, removeFromLoading] as const;
};
