import { useContext } from 'react';
import classNames from 'classnames';
import { TodoAppContext } from '../../TodoAppContext';

type Props = {
  id: number,
  completed: boolean,
  title: string,
  userId: number,
};

export const TodoItem: React.FC<Props> = ({
  id, completed, title,
}) => {
  const { processings, removeTodo, loading } = useContext(TodoAppContext);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
      key={id}
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
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(id)}
      >
        ×
      </button>

      {(loading || processings.includes(id) || (id === 0))
      && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div
            className="modal-background has-background-white-ter"
          />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
