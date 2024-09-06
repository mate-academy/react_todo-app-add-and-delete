import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleCompletedStatus: (id: number) => void;
  onDelete: (id: number) => void;
  processedIds: number[];
};

export const TodoList: React.FC<Props> = React.memo(function TodoList({
  todos,
  tempTodo,
  handleCompletedStatus,
  onDelete,
  processedIds,
}) {
  const renderTodoItem = (todo: Todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      handleCompletedStatus={handleCompletedStatus}
      onDelete={onDelete}
      processedId={processedIds}
    />
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(renderTodoItem)}
      {tempTodo && renderTodoItem(tempTodo)}
    </section>
  );
});
