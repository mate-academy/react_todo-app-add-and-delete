import React, { useContext } from 'react';
import { TodosContext } from '../TodoContext/TodoContext';
import { TodoHeader } from '../TodoHeader';
import { TodoList } from '../TodoList';
import { TodoFooter } from '../TodoFooter';
import { Errors } from '../Errors';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />
        {todos.length > 0 && (
          <>
            <TodoList />
            <TodoFooter />
          </>
        )}
      </div>
      <Errors />
    </div>
  );
};
