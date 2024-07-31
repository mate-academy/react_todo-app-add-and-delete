import React from 'react';
import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  todosAreLoadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosAreLoadingIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          todosAreLoadingIds={todosAreLoadingIds}
        />
      ))}
    </section>
  );
};
