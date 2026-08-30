/* eslint-disable prettier/prettier */
import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

type Props = {
  todos: TodoType[];
  tempTodo: TodoType | null;
  deletingIds: number[];
  onDelete: (todoId: number) => void;
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
        <Todo
          key={todo.id}
          todo={todo}
          isLoading={deletingIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <Todo
          todo={tempTodo}
          isLoading
        />
      )}
    </section>
  );
};
