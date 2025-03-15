import { Todo } from '../../types/Todo';
import classNames from 'classnames';

/* eslint-disable jsx-a11y/label-has-associated-control */
type Props = {
  tempTodo: Todo | null;
  isLoading: boolean;
};

export const TemporaryTodo: React.FC<Props> = ({
  tempTodo,
  isLoading = true,
}) => {
  const modalClassname = classNames('modal', 'overlay', {
    'is-active': isLoading,
  });

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      {/* 'is-active' class puts this modal on top of the todo */}
      <div data-cy="TodoLoader" className={modalClassname}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
