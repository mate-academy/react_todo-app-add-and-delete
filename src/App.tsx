/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './enums/FilterType';

export const App: React.FC = () => {
  // #region useState
  const [todos, setTodos] = useState<Todo[]>([]);
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [selectedLink, setSelectedLink] = useState(FilterType.All);
  const [errorButton, setErrorButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [todosCounter, setTodosCounter] = useState(0);
  const [loadingTodo, setLoadingTodo] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number>(-1);
  // #endregion

  // #region useEffect
  useEffect(() => {
    getTodos()
      .then(setAllTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    switch (selectedLink) {
      case FilterType.active:
        setTodos(allTodos.filter(todo => !todo.completed));
        break;
      case FilterType.completed:
        setTodos(allTodos.filter(todo => todo.completed));
        break;
      default:
        setTodos(allTodos);
        break;
    }
  }, [selectedLink, allTodos]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }

    return;
  }, [errorMessage]);
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setAllTodos={setAllTodos}
          allTodos={allTodos}
          setLoadingTodo={setLoadingTodo}
          setTodosCounter={setTodosCounter}
          setLoadingTodoId={setLoadingTodoId}
        />

        <TodoList
          todos={todos}
          allTodos={allTodos}
          setTodos={setTodos}
          setAllTodos={setAllTodos}
          loadingTodo={loadingTodo}
          setErrorMessage={setErrorMessage}
          setLoadingTodo={setLoadingTodo}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
        />

        {allTodos.length > 0 && (
          <Footer
            todosCounter={todosCounter}
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            todos={todos}
            setTodos={setTodos}
            setAllTodos={setAllTodos}
            setErrorMessage={setErrorMessage}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: errorButton || errorMessage.length === 0,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorButton(true)}
        />
        {errorMessage.length > 0 && errorMessage}
      </div>
    </div>
  );
};
