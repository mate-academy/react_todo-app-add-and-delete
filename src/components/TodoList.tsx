import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  onDelete: (todoId: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={deletingIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && (
      <TodoItem
        key="temporary-todo"
        todo={tempTodo}
        isLoading
        onDelete={onDelete}
      />
    )}
  </section>
);
