/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos } from './api/todos';

import { Todo } from './types/Todo';
import { Form } from './components/form';
import { Todos } from './components/todos';
import { ErrorType } from './types/Error';
import { FilterType } from './types/Filter';

const USER_ID = 10378;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.NONE);
  const [errorType, setErrorType] = useState<ErrorType>(ErrorType.NONE);

  useEffect(() => {
    getTodos(USER_ID)
      .then(res => setTodos(res.slice(0)))
      .catch(() => setErrorType(ErrorType.LOAD));
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorType(ErrorType.NONE);
    }, 3000);
  }, [errorType]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          { todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: todos.every((todo) => todo.completed),
              })}
            />
          )}

          <Form
            todos={todos}
            setTodos={setTodos}
            setErrorType={setErrorType}
            USER_ID={USER_ID}
          />

        </header>

        <section className="todoapp__main">
          <Todos
            todos={todos}
            filterType={filterType}
            setErrorType={setErrorType}
            setTodos={setTodos}
          />
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter((todo) => !todo.completed).length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filterType === FilterType.NONE,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterType(FilterType.NONE);
                }}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filterType === FilterType.ACTIVE,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterType(FilterType.ACTIVE);
                }}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filterType === FilterType.COMPLETED,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  setFilterType(FilterType.COMPLETED);
                }}
              >
                Completed
              </a>
            </nav>

            {todos.some((todo) => todo.completed) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={() => {
                  todos.map((item) => {
                    if (item.completed) {
                      return (
                        deleteTodo(item.id)
                          .then(() => {
                            setTodos(todos.filter((todo) => !todo.completed));
                          })
                      );
                    }

                    return item;
                  });
                }}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorType },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setErrorType(ErrorType.NONE)}
        />
        {errorType === ErrorType.LOAD && 'Unable to load todos'}
        {errorType === ErrorType.ADD && 'Unable to add a todo'}
        {errorType === ErrorType.DELETE && 'Unable to delete a todo'}
        {errorType === ErrorType.UPDATE && 'Unable to update a todo '}
      </div>
    </div>
  );
};
