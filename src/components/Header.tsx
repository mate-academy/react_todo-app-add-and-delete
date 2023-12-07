import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[],
  isDisabled: boolean,
  onHandleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (title: string) => void,
};

export const Header: React.FC<Props> = ({
  todos,
  isDisabled,
  onHandleSubmit,
  title,
  setTitle,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisabled, todos.length]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={isDisabled}
        />
      )}

      {/* Add a todo on form submit */}
      <form
        action="/"
        method="POST"
        onSubmit={onHandleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isDisabled}
          onChange={(event) => setTitle(event.target.value)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
