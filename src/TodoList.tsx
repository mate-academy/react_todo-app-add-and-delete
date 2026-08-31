import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from './types';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  processingIds: number[];
  isCreating: boolean;
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  processingIds,
  isCreating,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDelete={() => onDelete(todo.id)}
        isProcessed={processingIds.includes(todo.id)}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isProcessed={isCreating} />}
  </section>
);
