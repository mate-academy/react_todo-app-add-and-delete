/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { useContext, useEffect, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';

import { deleteTodo } from './api/todos';

import { AppContext } from './components/AppProvider/AppProvider';
import { Filter } from './components/Filter';
import { NewTodoForm } from './components/NewTodoForm';
import { TodoList } from './components/TodoList';
import { Error } from './types';

export const App: React.FC = () => {
  const {
    todos,
    error,
    setError,
    setTodos,
    setIsLoadingMany,
    setIsDeleting,
  } = useContext(AppContext);

  const activeTodos = useMemo(() => (
    todos.filter(({ completed }) => !completed)
  ), [todos]);

  const completedTodos = useMemo(() => (
    todos.filter(({ completed }) => completed)
  ), [todos]);

  const isActive = !activeTodos.length && todos.length > 0;

  useEffect(() => {
    window.setTimeout(
      setError, 3000, Error.None,
    );
  }, [error]);

  const clearCompleted = () => {
    setIsDeleting(true);

    completedTodos.forEach(async ({ id }) => {
      try {
        await deleteTodo(id);
      } catch {
        setError(Error.Delete);
      } finally {
        if (!error) {
          setTodos(activeTodos);
        }

        setIsDeleting(false);
      }
    });
  };

  const completeAll = () => {
    const newTodos = todos.map(todo => ({
      ...todo,
      completed: Boolean(activeTodos.length),
    }));

    setIsLoadingMany(true);
    setTimeout(setTodos, 800, newTodos);
    setTimeout(setIsLoadingMany, 800, false);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {Boolean(todos.length) && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={cn('todoapp__toggle-all', {
                active: isActive,
              })}
              onClick={completeAll}
            />
          )}

          <NewTodoForm />
        </header>

        <section
          className="todoapp__main"
          data-cy="TodoList"
        >
          <Routes>
            <Route
              path="/"
              element={<TodoList todos={todos} />}
            />

            <Route
              path="/active"
              element={<TodoList todos={activeTodos} />}
            />

            <Route
              path="/completed"
              element={<TodoList todos={completedTodos} />}
            />
          </Routes>
        </section>

        {Boolean(todos.length) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <Filter />

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className="todoapp__clear-completed"
              onClick={clearCompleted}
              style={{
                visibility: `${completedTodos.length
                  ? 'visible'
                  : 'hidden'}`,
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(Error.None)}
        />

        {error === Error.Add && (
          <>
            Unable to add a todo
            <br />
          </>
        )}

        {error === Error.Delete && (
          <>
            Unable to delete a todo
            <br />
          </>
        )}

        {error === Error.Update && (
          <>
            Unable to update a todo
            <br />
          </>
        )}

        {error === Error.Title && (
          'Title can\'t be empty'
        )}
      </div>
    </div>
  );
};
