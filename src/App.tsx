/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { getTodos, addTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 10387;

export enum Error {
  LOAD = 'load',
}

export enum FilterBy {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  const visibleTodos = todos.filter((todo) => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;

      case FilterBy.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const addError = (error: Error) => {
    setErrorMessage(error);
    window.setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setErrorMessage(null);
        const todosFromServer = await getTodos(USER_ID);

        setTodos(todosFromServer);
      } catch (error) {
        addError(Error.LOAD);
      }
    };

    loadTodos();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title cannot be empty');

      return;
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    };

    setTempTodo(newTodo);

    if (tempTodo) {
      addTodo(tempTodo)
        .then((response) => {
          setTodos([...todos, response]);
          setTitle('');
        })
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
        });
    }
  };

  const handleDelete = (id: number) => {
    setIsDeleting(true);

    deleteTodo(id)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id));
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsDeleting(false));
  };

  console.log(todos);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              value={title}
              placeholder="What needs to be done?"
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main">
          {todos.map(todo => (
            <div
              className={cn('todo',
                { completed: todo.completed })}
              key={todo.id}
            >
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span className="todo__title">{todo.title}</span>

              <button
                type="button"
                className="todo__remove"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>

              <div className={cn('modal overlay',
                { 'is-active': isDeleting })}
              >
                <div
                  className="modal-background has-background-white-ter"
                />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterBy === FilterBy.All,
                })}
                onClick={() => setFilterBy(FilterBy.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterBy === FilterBy.Active,
                })}
                onClick={() => setFilterBy(FilterBy.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterBy === FilterBy.Completed,
                })}
                onClick={() => setFilterBy(FilterBy.Completed)}
              >
                Completed
              </a>
            </nav>

            {visibleTodos.some((todo) => todo.completed) && (
              <button type="button" className="todoapp__clear-completed">
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {errorMessage && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage(null)}
          />

          {`Unable to ${errorMessage} a todos`}
        </div>
      )}
    </div>
  );
};
