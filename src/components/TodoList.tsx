/* eslint-disable import/no-cycle */
import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from './TodosContext';

export const TodoList: React.FC = () => {
  const { filteredTodos } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
          />
        );
      })}
    </section>
  );
};
