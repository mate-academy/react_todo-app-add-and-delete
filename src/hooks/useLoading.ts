import React from 'react';

export const useLoading = (initialValue: boolean = false) => {
  const [loading, setLoading] = React.useState(initialValue);

  const withLoading = async <T>(
    asyncFunction: () => Promise<T>,
  ): Promise<T> => {
    setLoading(true);
    try {
      const result = await asyncFunction();

      return result;
    } finally {
      setLoading(false);
    }
  };

  return [loading, withLoading] as const;
};
