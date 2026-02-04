import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './todoItem';

type Props = {
  todos: Todo[];
  loadingIds: number[];
  tempTodo: Todo | null;
  handleDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loadingIds,
  handleDelete,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={loadingIds.includes(todo.id)}
          onDelete={handleDelete}
        />
      ))}

      {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
    </section>
  );
};
