import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Prop = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Prop> = ({
  visibleTodos,
  tempTodo,
  processingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map((todo: Todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isLoading={processingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {!!tempTodo && (
        <TodoItem todo={tempTodo} isLoading={true} onDelete={onDelete} />
      )}
    </section>
  );
};
