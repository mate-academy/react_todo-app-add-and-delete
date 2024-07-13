import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
export type Props = {
  todos: Todo[];
  loading: boolean;
  deleting: number | null;
  onDelete: (id: number) => void;
  tempTodo: Todo | null;
};
export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  loading,
  deleting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={onDelete}
            loading={loading}
            deleting={deleting}
          />
        ))}
        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onDelete={onDelete}
            loading={loading}
            deleting={deleting}
          />
        )}
      </>
    </section>
  );
};
