import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  isFocused: boolean;
  isDisabled: boolean;
  handleQueryChange: (value: string) => void;
  handleSubmit: (event: React.FormEvent) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  isFocused,
  isDisabled,
  handleQueryChange,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => handleQueryChange(event.target.value)}
          disabled={isDisabled}
          autoFocus={isFocused}
          onFocus={() => isFocused}
          onBlur={() => !isFocused}
        />
      </form>
    </header>
  );
};
