import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../api/todos';

type Props = {
  todos: Todo[];
  addTodo: (newTodo: Todo) => void;
  setQuery: (query: string) => void;
  query: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  addTodo,
  setQuery,
  query,
  inputRef,
}) => {
  const createTodo = () => {
    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: query.trim(),
      completed: false,
    };

    addTodo(newTodo);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createTodo();
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: todos.every(todo => todo.completed),
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};

Header.displayName = 'Header';
