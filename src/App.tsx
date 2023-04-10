import React, { useState, useMemo, useEffect } from 'react';
import debounce from 'lodash.debounce';
import { TodoCreate } from './components/TodoCreate';
import { TodoInfo } from './components/TodoInfo';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { url } from './components/url';

export const USER_ID = '6757';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>();
  const [temporaryTodos, setTemporaryTodos] = useState<Todo[]>();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const countNotComplited = useMemo(
    () => todosFromServer?.some((todo: Todo) => !todo.completed),
    [todosFromServer],
  );

  const countComplited = useMemo(
    () => todosFromServer?.some((todo: Todo) => todo.completed),
    [todosFromServer],
  );

  const fetchTodos = (pass: string, callback?: () => void) => {
    return client
      .get(pass)
      .then((todos) => {
        setTodosFromServer(todos as Todo[]);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setTemporaryTodos([]);
        if (callback) {
          callback();
        }
      });
  };

  const askTodos = debounce(
    (pass, callback?: () => void) => fetchTodos(pass, callback),
    1000,
  );

  useEffect(() => {
    askTodos(url, () => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const reloadTodos = (promise: Promise<unknown>) => {
    promise
      .finally(() => {
        askTodos(url);
      })
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const deleteCompleted = async () => {
    if (todosFromServer) {
      todosFromServer.forEach((todo) => {
        if (todo.completed) {
          const promise = client.delete(`/todos/${todo.id}`);

          reloadTodos(promise);
        }
      });
    }
  };

  const clearCompleted = () => {
    if (todosFromServer) {
      todosFromServer.forEach((todo) => {
        if (countComplited && !countNotComplited) {
          const promise = client.patch(`/todos/${todo.id}`, {
            completed: false,
          });

          reloadTodos(promise);
        } else if (countNotComplited) {
          const promise = client.patch(`/todos/${todo.id}`, {
            completed: true,
          });

          reloadTodos(promise);
        }
      });
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoCreate
            setTemporaryTodos={setTemporaryTodos}
            setTodosFromServer={setTodosFromServer}
            clearCompleted={clearCompleted}
            setErrorMessage={setErrorMessage}
            countNotComplited={countNotComplited}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </header>

        <section className="todoapp__main">
          <TodoInfo
            temporaryTodos={temporaryTodos}
            todosFromServer={todosFromServer}
            askTodos={askTodos}
            setErrorMessage={setErrorMessage}
          />
        </section>

        <footer className="todoapp__footer">
          <Footer
            askTodos={askTodos}
            deleteCompleted={deleteCompleted}
            todosFromServer={todosFromServer}
            countComplited={countComplited}
          />
        </footer>
      </div>

      {errorMessage
      && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
