import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isProcessing?: boolean,
  onRemoveButtonClick?: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isProcessing = false,
  onRemoveButtonClick = () => {},
}) => {
  const { title, completed } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemoveButtonClick(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal', 'overlay', {
        'is-active': isProcessing,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
