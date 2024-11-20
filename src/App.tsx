/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { getTodos, USER_ID } from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { FilteringPanel } from './components/FilteringPanel';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { useAppContext } from './context/AppContext';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const { todos, setTodos, setError } = useAppContext();
  const shouldShowTodos = todos.length > 0;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todo</h1>
      <div className="todoapp__content">
        <Header />
        {shouldShowTodos && (
          <>
            <TodoList />
            <FilteringPanel />
          </>
        )}
      </div>
      <ErrorNotification />
    </div>
  );
};
