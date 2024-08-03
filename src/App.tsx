/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { deleteTodo, getTodos, USER_ID } from './api/todos';

import { FilterTodo, Todo } from './types/Todo';

import { ListTodo } from './components/ListTodo';
import { Footer } from './components/Footer';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState(FilterTodo.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingId, setIsLoadingId] = useState<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(data => {
        setTodos(data);
        setTempTodo(null);
      })
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
        case FilterTodo.active:
          return !todo.completed;

        case FilterTodo.completed:
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

  const handleClearCompleted = () => {
    completedTodos.forEach(({ id }) => deleteTodo(id));

    setTimeout(() => {
      setTodos(prevState => {
        return prevState.filter(todo => !todo.completed);
      });
    }, 300);
  };

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
            setTodos={setTodos}
            setFilter={setFilter}
            filter={filter}
            completedTodos={completedTodos}
            onRemoveCompleted={handleClearCompleted}
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
