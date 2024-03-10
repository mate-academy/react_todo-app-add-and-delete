export const focusInputField = (
  titleField: React.RefObject<HTMLInputElement>,
) => {
  if (titleField.current) {
    titleField.current.focus();
  }
};
