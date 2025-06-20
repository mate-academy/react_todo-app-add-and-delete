import React, { useEffect, useRef, useState } from 'react';

import { Todo } from '../../types/Todo';

type Props = {
  addTodo: (
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
  ) => void;
  tempTodo: Todo | null;
  allTodos: Todo[];
};

export const Header: React.FC<Props> = ({ addTodo, tempTodo, allTodos }) => {
  const [title, setTitle] = useState<string>('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    addTodo(title, setTitle);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allTodos.find(todo => todo.loading)) {
      return;
    }

    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [allTodos, tempTodo]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
          disabled={Boolean(tempTodo)}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
