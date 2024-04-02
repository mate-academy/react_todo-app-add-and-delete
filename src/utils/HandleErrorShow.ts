export const handleError = (
  ErrorNotification: string,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
) => {
  setErrorMessage(ErrorNotification);
  setTimeout(() => {
    setErrorMessage('');
  }, 3000);
};
