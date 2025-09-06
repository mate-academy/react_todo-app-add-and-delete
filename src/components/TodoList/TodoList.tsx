import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[];
  handleDelete: (todo: Todo) => void;
  deletingIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  handleDelete,
  deletingIds,
}) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          handleDelete={handleDelete}
          deletingIds={deletingIds}
        />
      ))}
    </>
  );
};
