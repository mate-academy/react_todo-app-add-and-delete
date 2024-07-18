import React, { useContext, useEffect } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { DispatchContext, StatesContext } from './context/Store';

export const App: React.FC = () => {
  const { todos } = useContext(StatesContext);
  const dispatch = useContext(DispatchContext);

  useEffect(() => {
    dispatch({ type: 'startLoading' });
    getTodos()
      .then(todosFromServer => {
        dispatch({ type: 'loadTodos', payload: todosFromServer });
      })
      .catch(() => {
        dispatch({ type: 'showError', payload: `Unable to load todos` });
      })
      .finally(() => {
        dispatch({ type: 'stopLoading' });
      });
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
        {todos.length !== 0 && <Footer />}
      </div>

      <ErrorNotification />
    </div>
  );
};
