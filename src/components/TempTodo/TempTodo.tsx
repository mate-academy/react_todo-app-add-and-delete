import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  tempTodo: Todo | null;
  loading: boolean;
}

export const TempTodo: React.FC<Props> = ({ tempTodo, loading }) => {
  return (
    <div className="todo" data-cy="Todo">
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>
      <span className="todo__title" data-cy="TodoTitle">
        {tempTodo?.title}
      </span>
      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
