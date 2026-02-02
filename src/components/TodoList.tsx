import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  deletingTodoId: number | null;
};

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
          onDelete={onDelete}
          loading={todo.id === deletingTodoId}
        />
      ))}
    </section>
  );
};
