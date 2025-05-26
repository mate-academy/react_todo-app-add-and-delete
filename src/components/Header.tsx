import React, { memo, useEffect } from 'react';

interface HeaderProps {
  handleNewTodoSubmit: (e: React.FormEvent) => void;
  newTodoTitle: string;
  handleNewTodoTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAddingTodo: boolean;
  inputRef: React.RefObject<HTMLInputElement>; // Додаємо тип для inputRef
}
const HeaderComponent: React.FC<HeaderProps> = ({
  handleNewTodoSubmit,
  newTodoTitle,
  handleNewTodoTitleChange,
  isAddingTodo,
  inputRef, //  Отримуємо inputRef з useTodoForm
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleNewTodoSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          // Додаємо обробник змін
          onChange={handleNewTodoTitleChange}
          disabled={isAddingTodo} // Вимикаємо поле вводу під час додавання
        />
      </form>
    </header>
  );
};

export const Header = memo(HeaderComponent); // Export memoized component
