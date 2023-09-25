/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  todoTitle: string;
  onTodoTitleChange: (title: string) => void;
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  todoTitle,
  onTodoTitleChange,
  onFormSubmit,
}) => {
  const titleInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (titleInput.current) {
      titleInput.current?.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length !== 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onFormSubmit}>
        <input
          ref={titleInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => onTodoTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
