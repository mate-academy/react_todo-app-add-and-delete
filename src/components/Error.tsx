export const handleError = (
  errorNotification: string,
  setErrorMessage: (message: string) => void,
) => {
  setErrorMessage(errorNotification);
  setTimeout(() => {
    setErrorMessage('');
  }, 3000);
};
