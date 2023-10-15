export const handleError = (
  set: (arg0: string) => void, errorMessage: string,
) => {
  set(errorMessage);
  setTimeout(() => {
    set('');
  }, 3000);
};
