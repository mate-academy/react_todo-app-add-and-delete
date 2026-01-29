import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  isLoading: number[];
  onDelete: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  isLoading,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
