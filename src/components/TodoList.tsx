import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  deletingTodoId: number | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoId,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isDeleting={deletingTodoId === todo.id}
        onDelete={onDelete}
      />
    ))}
    {tempTodo && <TodoItem todo={tempTodo} isTemp />}
  </section>
);
