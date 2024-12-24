import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  tempTodo?: Todo | null;
};

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  return (
    <>
      {tempTodo && (
        <div
          data-cy="Todo"
          className={classNames('todo', 'todo--loading')}
          key="tempTodo"
        >
          {/* eslint-disable-next-line */}
          <label className="todo__status-label" htmlFor="tempTodo">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              disabled
              id="tempTodo"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodo.title}
          </span>
          <button type="button" className="todo__remove" disabled>
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
