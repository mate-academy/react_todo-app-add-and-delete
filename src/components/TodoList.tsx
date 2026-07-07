import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
