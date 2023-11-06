import cn from 'classnames';

type Props = {
  title: string,
  completed: boolean,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({ title, completed, isLoading }) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo',
          {
            completed,
          })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        {/* Remove button appears only on hover */}
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay',
            {
              'is-active': isLoading,
            })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
