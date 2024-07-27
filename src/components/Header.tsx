import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface HeaderProps {
  todos: Todo[];
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string; // Changed from `newTodo` to `title`
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  todos,
  addTodo,
  title,
  onChange,
  onBlur,
  isLoading,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onChange}
          onBlur={onBlur}
          autoFocus
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
