import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onTodoDeletion: (id:number) => void,
  isLoading: boolean,
};

export const TodoElement: React.FC<Props> = ({
  todo,
  onTodoDeletion,
  isLoading,
}) => {
  const { completed, title, id } = todo;

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onTodoDeletion(id)}
      >
        ×
      </button>

      <div className={
        classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
