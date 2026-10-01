import React from 'react';
import type { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  deletingTodoIds: number[];
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={deletingTodoIds.includes(todo.id)}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default TodoList;
