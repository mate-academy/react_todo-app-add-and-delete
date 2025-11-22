import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface HeaderProps {
  todos: Todo[];
  activeCount: number;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isAppLoading: boolean;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  activeCount,
  title,
  setTitle,
  handleSubmit,
  isAppLoading,
  newTodoInputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.length > 0 && activeCount === 0,
        })}
        data-cy="ToggleAllButton"
        disabled={isAppLoading}
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={isAppLoading}
          ref={newTodoInputRef}
        />
      </form>
    </header>
  );
};
