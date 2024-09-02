import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete?: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, onDelete = () => {} }) => {
  const [isChecked, setIsChecked] = useState(todo.completed);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: isChecked,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={handleCheckboxChange}
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
      <div
        data-cy="TodoLoader"
        // className="modal overlay"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
