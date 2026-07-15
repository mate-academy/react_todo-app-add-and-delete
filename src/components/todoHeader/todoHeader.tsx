import React from 'react';

// пропси, які компонент очікує отримати від App
interface Props {
  handleSubmit: (event: React.FormEvent) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  isSubmitting: boolean;
  focusInput: React.RefObject<HTMLInputElement>;
}

// Створюємо компонент і деструктуризуємо пропси в параметрах функції
export const TodoHeader: React.FC<Props> = ({
  handleSubmit,
  newTodoTitle,
  setNewTodoTitle,
  isSubmitting,
  focusInput,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => setNewTodoTitle(event.target.value)}
          disabled={isSubmitting}
          ref={focusInput} // Прив'язуємо реф до інпуту
        />
      </form>
    </header>
  );
};
