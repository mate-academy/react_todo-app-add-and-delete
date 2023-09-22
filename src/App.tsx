/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext } from 'react';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorMessage } from './components/ErrorMessage/ErrorMessage';
import { Header } from './components/Header/Header';
import { TodosContext } from './contexts/TodosContext';

export const App: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header todos={todos} />

        <TodoList />

        {Boolean(todos.length) && (
          <TodoFooter todos={todos} />
        )}
      </div>

      <ErrorMessage />
    </div>
  );
};
