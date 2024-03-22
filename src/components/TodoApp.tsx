/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { USER_ID, getTodos } from '../api/todos';
import { UserWarning } from '../UserWarning';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { SetTodosContext, TodosContext } from './TodosContext';
import { Filter } from '../types/Filter';

export const TodoApp: React.FC = () => {
  const todos = useContext(TodosContext);
  const setTodos = useContext(SetTodosContext);

  const [filter, setFilter] = useState(Filter.All);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setTimeout(() => setError(''), 3000);
  }, [error]);

  const preparedTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case Filter.All:
          return todo;
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [filter, todos]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setTimeout(() => setError(''), 3000);
      });
  }, [setTodos, setError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleErrorDelete = () => {
    setError('');
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setError={setError} />

        <TodoList todos={preparedTodos} />

        {todos.length !== 0 && <Footer setFilter={setFilter} filter={filter} />}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorDelete}
        />
        {error}
      </div>
    </div>
  );
};
