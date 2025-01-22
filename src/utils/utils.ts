export const handleError = (
  error: string,
  setError: (error: string) => void,
  setIsErrorVisible: (isVisible: boolean) => void,
) => {
  setError(error);
  setIsErrorVisible(true);
};

export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorMessage: string,
  setError: (error: string) => void,
  setIsErrorVisible: (isVisible: boolean) => void,
) => {
  try {
    return await operation();
  } catch (error) {
    setError(errorMessage);
    setIsErrorVisible(true);

    return error;
  }
};
