import React from 'react';
import type Todo from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

/* eslint-disable react/jsx-filename-extension */

interface Props {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  deletingTodoId: number | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={todo.id === deletingTodoId}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};

export default TodoList;
