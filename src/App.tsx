/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { FilterType } from './types/FilterType';

export const App: React.FC = () => {
  const [allTodos, setAllTodos] = useState<Todo[]>([]);
  const [selectedLink, setSelectedLink] = useState(FilterType.All);
  const [errorButton, setErrorButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingTodo, setLoadingTodo] = useState(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number>(-1);

  useEffect(() => {
    getTodos()
      .then(setAllTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (selectedLink) {
      case FilterType.active:
        return allTodos.filter(todo => !todo.completed);
      case FilterType.completed:
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
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
          setLoadingTodoId={setLoadingTodoId}
        />
        <TodoList
          todos={filteredTodos}
          allTodos={allTodos}
          setAllTodos={setAllTodos}
          loadingTodo={loadingTodo}
          setErrorMessage={setErrorMessage}
          setLoadingTodo={setLoadingTodo}
          loadingTodoId={loadingTodoId}
          setLoadingTodoId={setLoadingTodoId}
        />
        {allTodos.length > 0 && (
          <Footer
            selectedLink={selectedLink}
            setSelectedLink={setSelectedLink}
            todos={filteredTodos}
            setAllTodos={setAllTodos}
            setErrorMessage={setErrorMessage}
            allTodos={allTodos}
            isSubmitting={loadingTodo}
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
