/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef } from 'react';
import { useTodos } from '../context/TodoProvider';
import { Errors } from '../types';

export const Header: React.FC = () => {
  const {
    todos,
    todoTitle,
    setTodoTitle,
    setErrorMessage,
    loading,
    createTodo,
  } = useTodos();

  const titleFiled = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleFiled.current) {
      titleFiled.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!todoTitle.trim()) {
      setErrorMessage(Errors.TitleEmpty);

      return; // щоб не додавався пустий item
    }

    createTodo(todoTitle.trim());
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {!!todos.length && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          name="NewTodoField"
          data-cy="NewTodoField"
          type="text"
          autoComplete="off"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={titleFiled}
          value={todoTitle}
          onChange={(event) => setTodoTitle(event?.target.value)}
          disabled={loading}
        />
      </form>
    </header>
  );
};
