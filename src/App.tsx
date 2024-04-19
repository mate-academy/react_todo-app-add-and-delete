/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { todosContext } from './Store';
import { Footer } from './components/Footer/Footer';
import { errorText } from './constants';
import { filterTodos } from './utils/utils';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoWithLoader } from './types/TodoWithLoader';

export const App: React.FC = () => {
  const {
    loading,
    todos,
    setTodos,
    filter,
    tempTodo,
    errorMessage,
    setErrorMessage,
    updatedAt,
  } = useContext(todosContext);
  const timerId = useRef(0);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        if (todosFromServer) {
          const newTodos: TodoWithLoader[] = todosFromServer.map(todo => {
            return {
              ...todo,
              loading: false,
            };
          });

          setTodos(newTodos);
        } else {
          setTodos([]);
        }
      })
      .catch(() => {
        setErrorMessage(errorText.noTodos);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      clearTimeout(timerId.current);
      timerId.current = window.setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  }, [errorMessage, loading]);

  const displayedTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [todos, filter, updatedAt]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />
        {todos.length > 0 && (
          <>
            <TodoList
              todos={displayedTodos}
              updatedAt={updatedAt}
              tempTodo={tempTodo}
            />
            <Footer />
          </>
        )}
      </div>

      <ErrorNotification errorMessage={errorMessage} />
    </div>
  );
};
