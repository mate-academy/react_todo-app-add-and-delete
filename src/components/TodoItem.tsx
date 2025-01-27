/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { ErrorMessage } from '../App';

interface TodoItemProps {
  id: number;
  title: string;
  completed: boolean;
  isLoading: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onDeleteFromServ: (id: number) => void;
  onError: (error: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  id,
  title,
  completed,
  isLoading,
  onToggle,
  onDelete,
  onDeleteFromServ,
  onError,
}) => {
  const handleCheckboxChange = () => {
    onToggle(id);
  };

  const handleDeleteTodo = () => {
    if (id) {
      onDelete(id);
      onDeleteFromServ(id);
    } else {
      onError(ErrorMessage.Delete);
    }
  };

  return (
    <div>
      <div
        data-cy="Todo"
        className={`todo ${completed ? 'todo completed' : ''} ${isLoading ? 'is-active' : ''}`}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={handleCheckboxChange}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={handleDeleteTodo}
        >
          ×
        </button>

        {/* <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form> */}

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </div>
  );
};
