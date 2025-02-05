import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  preparedTodos: Todo[];
  onRemoveTodo: (id: number) => Promise<void>;
  loading: number[];
  tempTodo: Todo | null | undefined;
}

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  loading,
  onRemoveTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onRemoveTodo={onRemoveTodo}
          isLoading={loading.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem todo={tempTodo} onRemoveTodo={onRemoveTodo} isLoading />
      )}
    </section>
  );
};
