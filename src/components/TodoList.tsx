import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleCompletedStatus: (id: number) => void;
  onDelete: (id: number) => void;
  processedId: number[];
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  tempTodo,
  handleCompletedStatus,
  onDelete,
  processedId,
}) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleCompletedStatus={handleCompletedStatus}
          onDelete={onDelete}
          processedId={processedId}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          handleCompletedStatus={handleCompletedStatus}
        />
      )}
    </section>
  );
});
