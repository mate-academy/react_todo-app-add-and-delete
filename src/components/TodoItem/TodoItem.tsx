import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete?: (deletedId: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete = () => {} }) => {
  const { id, title, completed } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={isCompleted}
          onChange={event => setIsCompleted(event.target.checked)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
