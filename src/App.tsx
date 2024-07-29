/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filterTodos = todos.filter(todo => {
    switch (filter) {
      case 'Active':
        return !todo.completed;
      case 'Completed':
        return todo.completed;
      default:
        return todo;
    }
  });

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleCreateTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    createTodo({
      completed: false,
      title: query,
      userId: USER_ID,
    }).then(newTodo => {
      setQuery('');

      setTodos(prevState => [...prevState, newTodo]);
    });
  };

  const handleDeleteTodo = (id: number) => {
    deleteTodo(id);
    setTodos(prevState =>
      prevState.filter(todo => {
        return todo.id !== id;
      }),
    );
  };

  const handleClearCompleted = () => {
    const completedTodosId = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    for (let i = 0; i < completedTodosId.length; i++) {
      deleteTodo(completedTodosId[i]);
    }

    setTodos(prevState => {
      return prevState.filter(todo => !todo.completed);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleCreateTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={handleChangeQuery}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filterTodos.map(todo => {
            return (
              <div
                data-cy="Todo"
                className={classNames('todo', 'item-enter-done', {
                  completed: todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                {/* Remove button appears only on hover */}
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  ×
                </button>

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div data-cy="TodoLoader" className="modal overlay">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Hide the footer if there are no todos */}
        {todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === 'All',
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('All')}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === 'Active',
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('Active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === 'Completed',
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('Completed')}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
