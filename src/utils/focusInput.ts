export const focusInput = (inputRef: React.RefObject<HTMLInputElement>) => {
  setTimeout(() => {
    inputRef.current?.focus();
  }, 0);
};
