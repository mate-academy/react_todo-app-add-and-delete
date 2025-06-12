import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (todoId: number) => Promise<void>;
  loadingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  loadingTodoIds,
}) => {
  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          loadingTodoIds={loadingTodoIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem key={tempTodo.id} todo={tempTodo} isActive={!!tempTodo} />
      )}
    </>
  );
};
