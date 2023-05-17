/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Triangle } from 'react-loader-spinner';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';

const USER_ID = 10413;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [filter, setFilter] = useState('all');

  const [title, setTitle] = useState('');

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'all':
        return true;
      case 'active':
        return !todo.completed;
      default:
        return todo.completed;
    }
  });

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTodo = {
      id: 0, userId: USER_ID, title, completed: false,
    };

    try {
      const addedTodo: Todo = await addTodo(USER_ID, newTodo);

      setTodos([...todos, addedTodo]);
      setTitle('');
    } catch (e) {
      setHasError(true);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      await deleteTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setHasError(false);
    } catch (error) {
      setHasError(true);
    }
  };

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos(USER_ID);

        setTodos(response);
        setIsLoading(false);
      } catch (e) {
        setIsLoading(true);
        setHasError(true);
      }
    };

    fetchTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      {isLoading ? (
        <Triangle
          height="80"
          width="80"
          color="orange"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          visible
        />
      ) : (
        <div className="todoapp__content">
          <header className="todoapp__header">
            {/* this buttons is active only if there are some active todos */}
            <button type="button" className="todoapp__toggle-all active" />

            {/* Add a todo on form submit */}
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </form>
          </header>

          <section className="todoapp__main">
            {visibleTodos.map(todo => {
              return (
                <div className={classNames('todo', {
                  completed: todo.completed,
                })}
                >
                  <label className="todo__status-label">
                    <input
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                    />
                  </label>

                  <span className="todo__title">{todo.title}</span>

                  {/* Remove button appears only on hover */}
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => handleDeleteTodo(todo.id)}
                  >
                    ×

                  </button>

                  {/* overlay will cover the todo while it is being updated */}
                  <div className="modal overlay">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Hide the footer if there are no todos */}
          {todos.length !== 0 && (
            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${visibleTodos.filter(todo => !todo.completed).length} items left`}
              </span>

              {/* Active filter should have a 'selected' class */}
              <nav className="filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filter === 'all',
                  })}
                  onClick={() => setFilter('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filter === 'active',
                  })}
                  onClick={() => setFilter('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filter === 'completed',
                  })}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </a>
              </nav>

              {/* don't show this button if there are no completed todos */}
              <button type="button" className="todoapp__clear-completed">
                Clear completed
              </button>
            </footer>
          )}
        </div>
      )}

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      {hasError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          <button
            type="button"
            className="delete"
            onClick={() => setHasError(false)}
          />

          Unable to add a todo
          {/* <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        </div>
      )}
    </div>
  );
};
