import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  handleCompletedStatus: (todoId: number) => void;
  onDelete: (todoId: number) => void;
  processedTodosIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleCompletedStatus,
  onDelete,
  processedTodosIds,
}) => {
  const todoBaseItem = (todo: Todo) => (
    <TodoItem
      key={todo.id}
      todo={todo}
      handleCompletedStatus={handleCompletedStatus}
      onDelete={onDelete}
      processedTodosIds={processedTodosIds}
    />
  );

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todoBaseItem)}
      {tempTodo && todoBaseItem(tempTodo)}
    </section>
  );
};
