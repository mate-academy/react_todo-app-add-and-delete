import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  handleDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({ todo, handleDelete }) => {
  const [isHovered, setHover] = useState(false);

  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {isHovered && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDelete(todo.id)}
        >
          ×
        </button>
      )}

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
