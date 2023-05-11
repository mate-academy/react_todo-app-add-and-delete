/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './components/UserWarning';
import { USER_ID } from './utils/constants';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Notification } from './components/Notification';

import { Todo } from './types/Todo';
import { TodoError } from './types/TodoError';
import { getTodos } from './api/todos';
import { Loader } from './components/Loader';
import { formatTodos } from './utils/formatResponse';
import { TodoResponse } from './types/TodoResponse';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>();
  const [errors, setErrors] = useState<TodoError[]>([]);
  const [todosToRender, setTodosToRender] = useState<Todo[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTempLoading, setIsTempLoading] = useState(false);
  const [toBeCleared, setToBeCleared] = useState<Todo[]>([]);

  const showError = (title = 'Unable to load') => {
    setErrors(prev => {
      const newError = {
        title,
        isImportant: true,
      };

      return prev ? [...prev, newError] : [newError];
    });
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos().then(res => {
      setTodos(formatTodos(res as TodoResponse[]));
    })
      .catch(() => showError())
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    setTodosToRender(todos);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {todosToRender && (
          <Header
            todosToRender={todosToRender}
            setTodosToRender={setTodosToRender}
            showError={showError}
            setTempTodo={setTempTodo}
            setIsTempLoading={setIsTempLoading}
            setTodos={setTodos}
          />
        )}
        {todos && !isLoading
          ? (
            <>
              <Main
                todos={todosToRender || todos}
                tempTodo={tempTodo}
                isTempLoading={isTempLoading}
                setTodos={setTodos}
                showError={showError}
                toBeCleared={toBeCleared}
              />
              <Footer
                todos={todos}
                todosToRender={todosToRender || todos}
                setTodosToRender={setTodosToRender}
                setToBeCleared={setToBeCleared}
              />
            </>
          )
          : !errors && <Loader />}
      </div>
      {!!errors.length
      && (
        <Notification
          errors={errors}
          setErrors={setErrors}
        />
      )}
    </div>
  );
};
