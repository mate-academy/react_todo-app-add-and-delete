import { useEffect, useState } from 'react';

export const useErrorMessage = (delay = 3000) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(null), delay);

    return () => clearTimeout(timer);
  }, [error, delay]);

  return [error, setError] as const;
};
