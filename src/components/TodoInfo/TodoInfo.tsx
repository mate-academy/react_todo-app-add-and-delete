import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (value: number) => void;
  onUpdate: (id: number, data: { completed: boolean; }) => void;
  isProcessing: (id: number) => boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo, onDelete, onUpdate, isProcessing,
}) => {
  const { title, completed, id } = todo;

  return (
    <li className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          onClick={() => onUpdate(id, { completed: !todo.completed })}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay',
        { 'is-active': isProcessing(id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </li>
  );
};
