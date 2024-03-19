import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { TodosContext } from './TodosContext';

export const TodoList: React.FC = () => {
  const { filteredTodos } = useContext(TodosContext);

  return (
    <>
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
    </>
  );
};
