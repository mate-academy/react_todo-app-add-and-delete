import React, { useContext } from 'react';
import { StateContext } from './TodosContext';
import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Error } from './Error';

export const TodoApp: React.FC = () => {
  const { todos, errorMessage } = useContext(StateContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && (
          <Footer />
        )}
      </div>

      {errorMessage && (
        <Error />
      )}

    </div>
  );
};
