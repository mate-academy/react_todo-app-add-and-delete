import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  preparedTodos: Todo[] | null;
  errorMessage: string;
  loading: number[];
  onRemoveTodo: (id: number) => Promise<void>;
};

export const TodoList: React.FC<Props> = ({
  preparedTodos,
  errorMessage,
  loading,
  onRemoveTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedTodos?.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          errorMessage={errorMessage}
          loading={loading.includes(todo.id)}
          onRemoveTodo={onRemoveTodo}
        />
      ))}
    </section>
  );
};
