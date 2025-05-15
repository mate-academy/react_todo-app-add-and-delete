/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';

interface Props {
  title: string;
  completed: boolean;
  onInputChange: () => void;
}

export const TempTodo = ({ title, completed, onInputChange }: Props) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onInputChange}
        />
      </label>

      {title ? (
        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>
      ) : (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
