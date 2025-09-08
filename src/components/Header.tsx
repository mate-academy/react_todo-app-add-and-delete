import React from 'react';
import { Todo } from '../types/Todo';

interface HeaderProps {
  code: string;
  handleCodeChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  todos: Todo[];
  activeTodosCount: number;
  toggleAllTodos: () => void;
  isSubmitting?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  code,
  handleCodeChange,
  handleSubmit,
  todos,
  activeTodosCount,
  toggleAllTodos,
  isSubmitting = false,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={
          'todoapp__toggle-all' +
          (activeTodosCount === 0 && todos.length > 0 ? ' active' : '')
        }
        data-cy="ToggleAllButton"
        onClick={toggleAllTodos}
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          autoFocus
          onChange={handleCodeChange}
          value={code}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
