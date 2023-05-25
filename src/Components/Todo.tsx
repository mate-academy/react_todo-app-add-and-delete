import { useState } from 'react';
import { Todo as TodoType } from '../types/Todo';

interface Props {
  todo: TodoType
  temp?: boolean,
  handleRemoveTodo?: (id: number) => void,
}

export const Todo: React.FC<Props> = ({ todo, temp, handleRemoveTodo }) => {
  const { title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleRemoveClick = () => {
    if (!temp && handleRemoveTodo) {
      handleRemoveTodo(todo.id);
      setIsDeleting(true);
    }
  };

  return (
    <div
      className={`todo ${completed && 'completed'}`}
      style={{
        opacity: `${temp || isDeleting ? '0.1' : '1'}`,
      }}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleRemoveClick}
      >
        ×
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
