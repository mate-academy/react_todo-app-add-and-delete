import React from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  visibleTodos: Todo[];
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
  deleteId: number[];
  onToggle: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  onDelete,
  tempTodo,
  deleteId,
  onToggle,
}: Props) => {
  return (
    <div data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoElement
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          isLoading={deleteId.includes(todo.id)}
          onToggle={onToggle}
        />
      ))}
      {tempTodo && (
        <TodoElement
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={onDelete}
          isLoading={true}
          onToggle={onToggle}
        />
      )}
    </div>
  );
};
