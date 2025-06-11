/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';
import { ActiveLink } from './types/ActiveLink';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [activeLink, setActiveLink] = useState<ActiveLink>(ActiveLink.All);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setErrorMessage('');
        timeoutRef.current = null;
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [errorMessage]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
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
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          title={title}
          setTitle={setTitle}
          setErrorMessage={setErrorMessage}
          inputRef={inputRef}
        />

        <TodoList
          todos={todos}
          tempTodo={tempTodo}
          loadingIds={loadingIds}
          setLoadingIds={setLoadingIds}
          setTodos={setTodos}
          setErrorMessage={setErrorMessage}
          activeLink={activeLink}
          focusInput={focusInput}
        />

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
            setErrorMessage={setErrorMessage}
            setLoadingIds={setLoadingIds}
            focusInput={focusInput}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
