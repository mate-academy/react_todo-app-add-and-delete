import React from 'react';
import classNames from 'classnames';
import { ErrorMessages } from '../types/enums';

interface HeaderProps {
  allCompleted: boolean;
  onAddTodo: (title: string) => Promise<void>;
  isLoading: boolean;
  setError: (error: ErrorMessages) => void;
  setIsLoading: (isLoading: boolean) => void;
  title: string;
  setTitle: (title: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  inputRef,
  allCompleted,
  onAddTodo,
  isLoading,
  setError,
  title,
  setTitle,
}) => {
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError(ErrorMessages.NAMING_TODOS);
      const timer = setTimeout(() => {
        setError(ErrorMessages.DEFAULT);
      }, 3000);

      return () => clearTimeout(timer);
    }

    try {
      await onAddTodo(title.trim());
    } catch (error) {}
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: allCompleted })}
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={isLoading}
          autoFocus
        />
      </form>
    </header>
  );
};
