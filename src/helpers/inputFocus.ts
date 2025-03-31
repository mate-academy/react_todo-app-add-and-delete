export const focusTodoInput = () => {
  document.querySelector<HTMLInputElement>('[data-cy="NewTodoField"]')?.focus();
};
