import React from 'react';
import { Todo } from '../../types/Todo';
import '../../styles/spinner.scss';

interface Props {
  todo: Todo;
  handleDelete: (todo: Todo) => void;
  deletingIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDelete,
  deletingIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''} ${todo.loading || deletingIds.includes(todo.id) ? 'loading' : ''}`}
    >
      <label
        className="todo__status-label"
        htmlFor={`todo-${todo.id}`}
        aria-labelledby={`todo-title-${todo.id}`}
      >
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todo)}
      >
        ×
      </button>

      {(todo.loading || deletingIds.includes(todo.id)) && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
