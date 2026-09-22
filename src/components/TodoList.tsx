import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
type Props = {
  filterdTodos: Todo[];
  onToggle: (value: number, valueq: boolean) => void;
  onDelete: (value: number) => void;
  deletingTodoId: number | null;
};

export const TodoList = ({
  filterdTodos,
  onToggle,
  onDelete,
  deletingTodoId,
}: Props) => {
  return (
    <>
      {filterdTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          deletingTodoId={deletingTodoId}
        />
      ))}
    </>
  );
};
