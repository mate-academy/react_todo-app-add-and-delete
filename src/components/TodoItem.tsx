import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  selectedTodoId?: number;
  onDelete: (todoId: number) => void;
  onSelect?: (todo: Todo) => void;
  deletingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onSelect = () => {},
  onDelete = () => {},
  deletingTodoId,
}) => {
  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        {' '}
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onSelect?.(todo)}
          disabled
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
        data-cy="TodoDelete"
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${todo.id === 0 || deletingTodoId ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
