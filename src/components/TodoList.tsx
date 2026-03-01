import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  deletingIds: number[];
  handleDelete: (todoId: number) => void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletingIds,
  handleDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deleting={deletingIds.includes(todo.id)}
          handleDelete={handleDelete}
        />
      ))}
    </section>
  );
};
