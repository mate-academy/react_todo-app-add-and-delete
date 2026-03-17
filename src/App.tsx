/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';

// Import types area
import type { Todo, ErrorType, Status } from './types';

// Import components area

// prettier-ignore
import { ErrorNotification }
  from './components/Notifications/ErrorNotification';

import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { Section } from './components/Section/Section';

export const App: React.FC = () => {
  const [error, setError] = React.useState<ErrorType>(null);
  const [status, setStatus] = React.useState<Status>('All');
  const [todos, setTodos] = React.useState<Todo[]>([]);

  const [processingId, setProcessingId] = React.useState<number | null>(null);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(dados => {
        setTodos(dados);
      })
      .catch(() => setError('load'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (status === 'Active') {
      return !todo.completed;
    }

    if (status === 'Completed') {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setTodos={setTodos}
          setError={setError}
          setProcessingId={setProcessingId}
          inputRef={inputRef}
        />
        <Section
          setTodos={setTodos}
          setError={setError}
          visibleTodos={visibleTodos}
          processingId={processingId}
          setProcessingId={setProcessingId}
          inputRef={inputRef}
        />

        {/* Hide the footer if there are no todos */}

        {todos.length > 0 && (
          <Footer
            status={status}
            setStatus={setStatus}
            todos={todos}
            setTodos={setTodos}
            processingId={processingId}
            setError={setError}
            inputRef={inputRef}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification error={error} onClose={() => setError(null)} />
    </div>
  );
};
