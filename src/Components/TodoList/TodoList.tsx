import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../Todo/TodoItem';

type Props = {
  todos: Todo[];
  updatingTodoId: number | null;
  isRemovingCompleted: boolean;
  isUpdatingEveryStatus: boolean;
  isEveryTotoCompleted: boolean;
  onTodoRemove: (todoId: number) => void;
  onTodoUpdate: (todo: Todo) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  updatingTodoId,
  isRemovingCompleted,
  isUpdatingEveryStatus,
  isEveryTotoCompleted,
  onTodoRemove,
  onTodoUpdate,
}) => (
  <section className="todoapp__main">
    {todos.map((todo) => (
      <TodoItem
        key={todo.id}
        todo={todo}
        updatingTodoId={updatingTodoId}
        isRemovingCompleted={isRemovingCompleted}
        isUpdatingEveryStatus={isUpdatingEveryStatus}
        isEveryTotoCompleted={isEveryTotoCompleted}
        onTodoRemove={onTodoRemove}
        onTodoUpdate={onTodoUpdate}
      />
    ))}
  </section>
);
