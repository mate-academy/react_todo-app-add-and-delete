/* eslint-disable max-len */
import React, { useContext } from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { TodoContext } from './contexts/TodoContext';

export const App: React.FC = () => {
  const { todos } = useContext(TodoContext);

  const activeItems = todos.filter(({ completed }) => {
    return !completed;
  }).length;

  const completedTodos = todos
    .filter(({ completed }) => completed)
    .map(({ id }) => id);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {todos.length > 0 && (
          <>
            <TodoList />

            <TodoFooter
              activeItems={activeItems}
              completedTodos={completedTodos}
            />
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
