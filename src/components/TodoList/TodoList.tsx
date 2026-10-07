import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoIds: Set<number>;
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingTodoIds.has(todo.id)}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
