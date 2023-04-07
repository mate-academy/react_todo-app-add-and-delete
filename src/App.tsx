import React, { useState, useMemo } from 'react';
import debounce from 'lodash.debounce';
import { TodoCreate } from './components/TodoCreate';
import { TodoInfo } from './components/TodoInfo';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = '6757';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>();
  const [errorMessage, setErrorMessage] = useState('');

  const countNotComplited = useMemo(() => todosFromServer?.some(
    (todo: Todo) => todo.completed === false,
  ), [todosFromServer]);

  const countComplited = useMemo(() => todosFromServer?.some(
    (todo: Todo) => todo.completed === true,
  ), [todosFromServer]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const fetchTodos = (url: string) => {
    client
      .get(url)
      .then((todos) => {
        setTodosFromServer(todos as Todo[]);
      })
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const askTodos = debounce((url) => fetchTodos(url), 1000);

  const reloadTodos = (ask: Promise<unknown>) => {
    ask
      .finally(() => {
        askTodos(`/todos?userId=${USER_ID}`);
      })
      .catch(() => setErrorMessage('Unable to update a todo'));
  };

  const clearCompleted = async (status: string) => {
    if (todosFromServer) {
      todosFromServer.forEach((todo => {
        switch (status) {
          case 'completed':
            if (todo.completed) {
              const ask = client.delete(`/todos/${todo.id}`);

              reloadTodos(ask);
            }

            break;

          case 'invert':
          default:
            if (countComplited && !countNotComplited) {
              const ask = client.patch(`/todos/${todo.id}`, { completed: false });

              reloadTodos(ask);
            } else if (countNotComplited) {
              const ask = client.patch(`/todos/${todo.id}`, { completed: true });

              reloadTodos(ask);
            }

            break;
        }
      }));
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <TodoCreate
            setErrorMessage={setErrorMessage}
            clearCompleted={clearCompleted}
            askTodos={askTodos}
            todosFromServer={todosFromServer}
            countNotComplited={countNotComplited}
          />
        </header>

        <section className="todoapp__main">
          <TodoInfo
            setErrorMessage={setErrorMessage}
            todosFromServer={todosFromServer}
            askTodos={askTodos}
          />
        </section>

        <footer className="todoapp__footer">
          <Footer
            askTodos={askTodos}
            clearCompleted={clearCompleted}
            todosFromServer={todosFromServer}
            countComplited={countComplited}
          />
        </footer>
      </div>

      {errorMessage && <ErrorNotification errorMessage={errorMessage} /> }

    </div>
  );
};
