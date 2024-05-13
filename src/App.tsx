import { FC, useEffect, useState } from 'react';

import { Header, TodoList, Footer, ErrorNotification } from './components';

import { getFilteredTodos, getTodos } from './helpers';

import { ErrorType, StatusSelect, Todo } from './types';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[] | []>([]);

  const [status, setStatus] = useState<StatusSelect>(StatusSelect.All);

  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  const filteredTodo = getFilteredTodos(todos, status);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const result = await getTodos();

        setTodos(result);
      } catch (er) {
        setErrorType('load');

        setTimeout(() => {
          setErrorType(null);
        }, 3000);
      }
    };

    fetchTodo();
  }, [errorType, status]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />

        <TodoList todos={filteredTodo} />

        <Footer setStatus={setStatus} status={status} todos={todos} />
      </div>

      <ErrorNotification errorType={errorType} setError={setErrorType} />
    </div>
  );
};
