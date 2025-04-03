import React, { useContext, useEffect } from 'react';
import { getTodos } from './api/todos';
import TodoList from './components/TodoList/TodoList';
import Footer from './components/Footer/Footer';
import ErrorMessage from './components/ErrorMessage';
import Header from './components/Header';
import callError from './utils/callError';
import { MainContext } from './ContextProvider/ContextProvider';

export const App: React.FC = () => {
  const { todos, setTodos, setError, error } = useContext(MainContext);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => callError(setError, 'load'));
  }, [setTodos, setError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && <Footer />}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
};
