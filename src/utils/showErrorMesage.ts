let errorTimeout: NodeJS.Timeout | null = null;

export function showErrorMesage(
  errorText: string,
  setError: (el: string) => void,
): void {
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  setError(errorText);

  errorTimeout = setTimeout(() => {
    setError('');
    errorTimeout = null;
  }, 3000);
}
