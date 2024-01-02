/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorList, Footer, Header, TodoList } from './components';
import { useTodos } from './context';

export const App: React.FC = () => {
  const { todos } = useTodos();

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />
        {todos.length > 0 && <Footer />}
      </div>

      <ErrorList />
    </div>
  );
};
