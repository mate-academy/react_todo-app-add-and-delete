import React, { useRef, useEffect } from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  isDisable: boolean;
  onHandleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  title: string;
  setTitle: (title: string) => void;
};

export const Header: React.FC<Props> = ({
  todos,
  isDisable,
  onHandleSubmit,
  title,
  setTitle,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDisable, todos.length]);

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={isDisable}
        />
      )}
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
          disabled={isDisable}
          onChange={(e) => setTitle(e.target.value)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
