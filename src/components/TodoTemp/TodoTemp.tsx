import { useContext } from 'react';
import classnames from 'classnames';

import { LoadingContext } from '../../context/LoadingContext';
import { TodoContext } from '../../context/TodoContext';

export const TodoTemp = () => {
  const { tempTodo } = useContext(TodoContext);
  const { isLoading } = useContext(LoadingContext);

  return (
    <div data-cy="Todo" className="todo">
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo?.title}
      </span>

      <button type="button" className="todo__remove" data-cy="TodoDelete">
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classnames(
          'modal overlay', {
            'is-active': isLoading,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
