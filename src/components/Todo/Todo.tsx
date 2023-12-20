import classNames from 'classnames';

interface Props {
  title: string,
  id: number,
  completed: boolean,
}

export const Todo: React.FC<Props> = ({
  title,
  id = 0,
  completed,
}) => (
  <div
    data-cy="Todo"
    className={classNames('todo', {
      completed,
    })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={completed}
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {title}
    </span>
    <button type="button" className="todo__remove" data-cy="TodoDelete">
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={classNames('modal overlay', {
        'is-active': id === 0,
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
