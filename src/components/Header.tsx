import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  title: string;
  titleRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  onSaveTitle: (title: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  title,
  titleRef,
  isLoading,
  onSaveTitle,
  onSubmit,
}) => {
  const completedAllTodos = () => {
    return todos.every(todo => todo.completed);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: completedAllTodos(),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={titleRef}
          value={title}
          onChange={event => onSaveTitle(event.target.value)}
          className={classNames('todoapp__new-todo', {
            'is-loading': isLoading,
          })}
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
