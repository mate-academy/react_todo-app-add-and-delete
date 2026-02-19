import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  onSubmit: (event: React.FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string;
  setTitle: (value: string) => void;
  tempTodo: Todo | null;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  newTodoField,
  title,
  setTitle,
  tempTodo,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={newTodoField}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={!!tempTodo}
        />
      </form>
    </header>
  );
};
