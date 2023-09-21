import React from 'react';
import { TodoItem } from '../TodoItem';
import { useTodos } from '../../TodosContext';

export const Main: React.FC = () => {
  const { filteredTodos, tempTodos } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodos[0]?.id === 0 && <TodoItem todo={tempTodos[0]} />}
    </section>
  );
};
