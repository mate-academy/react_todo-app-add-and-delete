import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  deletingTodoIds: number[];
  onDelete: (todoId: number) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  deletingTodoIds,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        isLoading={deletingTodoIds.includes(todo.id)}
        onDelete={onDelete}
      />
    ))}

    {tempTodo && <TodoItem todo={tempTodo} isLoading onDelete={onDelete} />}
  </section>
);
