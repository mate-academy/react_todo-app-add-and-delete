/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';

type Props = {
  tempTitle: Todo;
};

export const TempTodo: React.FC<Props> = ({ tempTitle }) => {
  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          disabled
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTitle.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        disabled
      >
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
