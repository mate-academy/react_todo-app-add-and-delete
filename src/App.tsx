import React, { useContext, useMemo } from 'react';

import { UserWarning } from './UserWarning';

import { getFilteredTodos } from './utils/getFilteredTodos';
import { USER_ID } from './utils/constants';

import { TodoContext } from './context/TodoContext';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const { todos, status, errorMessage } = useContext(TodoContext);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodoList todos={filteredTodos} />
            </section>

            <TodoFooter />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification />
      )}
    </div>
  );
};
