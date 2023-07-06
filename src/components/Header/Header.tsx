/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  activeTodos: Todo[] | null,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  isLoading: boolean,
  newTodoTitle: string
  setNewTodoTitle: (title: string) => void,
};

export const Header: React.FC<Props> = ({
  activeTodos,
  handleSubmit,
  isLoading,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: activeTodos,
        })}
        aria-label="button"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
          value={newTodoTitle}
          onChange={(event) => setNewTodoTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
