import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: () => void;
  isLoading: boolean,
}

export const TodoItem = ({ todo, onDelete, isLoading }: TodoItemProps) => {
  const [isCompleted, setIsCompleted] = useState(false);

  const handleStatusChange = () => {
    if (!isCompleted) {
      setIsCompleted(true);
    } else {
      setIsCompleted(false);
    }
  };

  return (
    <div
      className={`todo ${isCompleted ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleStatusChange}
        />
      </label>

      <span
        className="todo__title"
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={onDelete}
      >
        ×
      </button>

      <input
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
      // value="Todo is being edited now"
      />

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames({
        'modal overlay': !isLoading,
        'modal overlay is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
