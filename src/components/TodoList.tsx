import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface ListProps {
  todos: Todo[];
  tempTodo: Todo | undefined;
  onDelete: (id: number) => void;
  todoLoading: boolean;
  loadingIds: Set<number>;
}

export const TodoList: React.FC<ListProps> = ({
  todos,
  tempTodo,
  onDelete,
  todoLoading,
  loadingIds,
}) => (
  <>
    {todos.map((todo: Todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() => onDelete(todo.id)}
          isLoading={loadingIds.has(todo.id)}
        ></TodoItem>
      );
    })}

    {tempTodo && todoLoading && (
      <TodoItem key="temp-todo" todo={tempTodo} isLoading={todoLoading} />
    )}
  </>
);
