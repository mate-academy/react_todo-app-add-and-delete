/* eslint-disable prettier/prettier */
import React, { useEffect, useRef } from 'react';
import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[];
  query: string;
  updatingTodoIds: number[];
  setQuery: (value: string) => void;
  handleSubmit: (value: React.FormEvent<HTMLFormElement>) => void;
  updateTodo: (value: Todo) => void;
}
/* eslint-disable prettier/prettier */
export const Header: React.FC<Props> = ({
  query,
  todos,
  updatingTodoIds,
  setQuery,
  handleSubmit,
  updateTodo,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (updatingTodoIds.length === 0) {
      inputRef.current?.focus();
    }
  }, [updatingTodoIds]);

  const handleToggleAllButton = (allTodos: Todo[]) => {
    if (allTodos.some(todo => !todo.completed)) {
      allTodos
        .filter(todo => !todo.completed) // обновляем только те, что false
        .forEach(todo => updateTodo({ ...todo, completed: true }));
    } else {
      allTodos
        .filter(todo => todo.completed) // обновляем только те, что true
        .forEach(todo => updateTodo({ ...todo, completed: false }));
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todos.length > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${todos.every(todo => todo.completed === true) ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAllButton(todos)}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
          disabled={updatingTodoIds.length > 0}
        />
      </form>
    </header>
  );
};
