/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';

import TodoList from './components/TodoList';
import ErrorNotification from './components/ErrorNotification';

import { useTodosContext } from './context/TodosProvider';
import { TodosError } from './types/TodosErrors';
import Header from './components/Header';
import Footer from './components/Footer';

export const App: React.FC = () => {
  const { todos, handleErrorMessage, setTodos } = useTodosContext();

  useEffect(() => {
    getTodos()
      .then(data => setTodos(data))
      .catch(handleErrorMessage(TodosError.LOAD_TODOS));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && <Footer />}
      </div>
      <ErrorNotification />
    </div>
  );
};
