import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (id: number) => void;
  todoId: number | null;
  setTodoId: (id: number | null) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  onDelete,
  todoId,
  setTodoId,
}) => {
  const { id, title, completed } = todo;

  const handleDelete = () => {
    setTodoId(id);
    onDelete(id);
  };

  return (
    <div
      key={id}
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
      >
        ×
      </button>

      <div className={cn('modal overlay', { 'is-active': todoId === id })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
