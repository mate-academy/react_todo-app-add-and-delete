/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  onAdd: (title: string) => void;
  adding: boolean;
  errorMsg: string;
  todos: Todo[];
};

export const Header: React.FC<Props> = ({ onAdd, adding, errorMsg, todos }) => {
  const [title, setTitle] = useState('');
  const inputFocused = useRef<null | HTMLInputElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onAdd(title.trim());
  };

  useEffect(() => {
    if (errorMsg.length === 0 && !adding) {
      setTitle('');
    }

    inputFocused.current?.focus();
  }, [adding, todos.length]);

  useEffect(() => {
    inputFocused.current?.focus();
  }, []);

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
          disabled={adding}
          ref={inputFocused}
          data-cy="NewTodoField"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
