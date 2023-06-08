import classNames from 'classnames';
import { useState } from 'react';

interface TodoItemProps {
  title: string;
  id: number;
  completed: boolean;
  onDeleteTodo: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  title,
  id,
  completed,
  onDeleteTodo,
}) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = (todoId: number) => {
    setIsDeleted(true);
    onDeleteTodo(todoId);
  };

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
          readOnly
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', { 'is-active': isDeleted })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
