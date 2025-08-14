/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type Props = {
  todo: Todo;
  toggleTodo: (todo: Todo) => void;
  isLoading: boolean;
  updatingTodoIds: number[];
  onDelete: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  toggleTodo,
  updatingTodoIds,
  onDelete,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loader todoId={todo.id} updatingTodoIds={updatingTodoIds} />
    </div>
  );
};
