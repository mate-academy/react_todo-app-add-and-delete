/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useContext } from 'react';
import classNames from 'classnames';

import { UserWarning } from './components/UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';

import { Todo } from './types/Todo';
import { getTodos } from './api/todos';
import { PageContext } from './utils/GlobalContext';

export const App: React.FC = () => {
  const {
    error,
    setError,
    todoList,
    setTodoList,
    USER_ID,
  } = useContext(PageContext);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todoList);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodoList)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, [setError, setTodoList, USER_ID]);

  useEffect(() => {
    setFilteredTodos(todoList);
  }, [todoList]);

  const hideError = () => {
    setError('');
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <Header
          todos={filteredTodos}
          setTempTodo={setTempTodo}
        />

        {todoList.length > 0
          && (
            <>
              <Main
                todos={filteredTodos}
                tempTodo={tempTodo}
              />

              <Footer
                setFilteredTodos={setFilteredTodos}
              />
            </>
          )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />
        {error}
      </div>
    </div>
  );
};
