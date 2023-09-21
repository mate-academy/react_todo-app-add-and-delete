import React, { useState } from 'react';
import TodoHeader from '../TodoHeader';
import TodoFooter from '../TodoFooter';
import TodoList from '../TodoList';
import { useTodo } from '../TodoContext/TodoContext';
import { Filter } from '../../types/Filter';
import TodoNotification from '../TodoNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useTodo();
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.all);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={todos}
              selectedFilter={selectedFilter}
            />
            <TodoFooter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
            />
          </>
        )}
      </div>

      <TodoNotification />
    </div>
  );
};
