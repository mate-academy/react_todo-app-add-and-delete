export const handleError = (set: (string: string) => void, message: string) => {
  set('');
  set(message);

  setTimeout(() => {
    set('');
  }, 3000);
};
