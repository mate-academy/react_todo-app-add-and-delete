/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';

import { ListTodo } from './components/ListTodo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingId, setIsLoadingId] = useState<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, [tempTodo]);

  useEffect(() => {
    setCompletedTodos(todos.filter(todo => todo.completed));
  }, [todos]);

  const filterTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case 'Active':
          return !todo.completed;
        case 'Completed':
          return todo.completed;
        default:
          return todo;
      }
    });
  }, [todos, filter]);

  const onDelete = useCallback((id: number) => {
    deleteTodo(id).finally(() => setIsLoadingId(null));

    setTimeout(() => {
      setTodos(prevState =>
        prevState.filter(todo => {
          return todo.id !== id;
        }),
      );
    }, 1000);
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTempTodo={setTempTodo}
          setErrorMessage={setErrorMessage}
          setIsLoadingId={setIsLoadingId}
        />

        <ListTodo
          tempTodo={tempTodo}
          todos={filterTodos}
          deleteTodo={onDelete}
          isLoadingId={isLoadingId}
          setIsLoadingId={setIsLoadingId}
        />

        {/* Hide the footer if there are no todos */}
        {todos.length && (
          <Footer
            todos={todos}
            filterTodo={setFilter}
            filter={filter}
            completedTodos={completedTodos}
          />
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
