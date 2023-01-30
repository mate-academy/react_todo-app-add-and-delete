import React, { memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onTodoDelete: (todoId: number) => Promise<void>;
  deletingTodosIds: number[]
};

export const TodoList: React.FC<Props> = memo(({
  todos,
  onTodoDelete,
  deletingTodosIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onTodoDelete={onTodoDelete}
          isDeleting={deletingTodosIds.includes(todo.id)}
        />
      ))}
    </section>
  );
});
