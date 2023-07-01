/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[],
  formSummit: (event: React.FormEvent) => void,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
  isCreating: boolean,
}

export const Header: React.FC<Props> = ({
  todos,
  formSummit,
  todoTitle,
  setTodoTitle,
  isCreating,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos.length && (
        <button type="button" className="todoapp__toggle-all active" />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={formSummit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isCreating}
        />
      </form>
    </header>
  );
};
