import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingIds: number[];
  onDelete: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ todos, deletingIds, onDelete }) => {
  return (
    <>
      {todos.map(todo => {
        const isDeleting = deletingIds.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isDeleting={isDeleting}
            onDelete={onDelete}
          />
        );
      })}
    </>
  );
};
