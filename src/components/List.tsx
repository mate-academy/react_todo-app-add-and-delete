import React from 'react';
import { Todo } from '../types/Todo';
import { Item } from './Item';

type Props = {
  visibleTodos: Todo[];
  handleDeleteTodo: (id: number) => void;
  loadingTodos: number[];
  tempTodo: Todo | null;
};

export const List: React.FC<Props> = ({
  visibleTodos,
  handleDeleteTodo,
  loadingTodos,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <Item
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={loadingTodos.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <Item
          key={0}
          todo={tempTodo}
          isLoading={loadingTodos.includes(0)}
          handleDeleteTodo={() => {}}
        />
      )}
    </section>
  );
};
