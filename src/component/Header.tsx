import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';
import { USER_ID } from '../api/httpClient';

type Props = {
  todos: Todo[];
  handleChangeCompletedAllTodos: () => void;
  handleAddTodo: (newTodo: Todo) => void;
  setQuery: (query: string) => void;
  query: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = React.memo(
  ({
    todos,
    handleChangeCompletedAllTodos,
    handleAddTodo,
    setQuery,
    query,
    inputRef,
  }) => {
    const handleCreateTodo = () => {
      const newTodo: Todo = {
        id: 0,
        userId: USER_ID,
        title: query.trim(),
        completed: false,
      };

      handleAddTodo(newTodo);
    };

    const onSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      handleCreateTodo();
    };

    const checkAllActiveTodos = () => todos.every(todo => todo.completed);

    return (
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: checkAllActiveTodos,
          })}
          data-cy="ToggleAllButton"
          onClick={handleChangeCompletedAllTodos}
        />
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
  },
);

Header.displayName = 'Header';
