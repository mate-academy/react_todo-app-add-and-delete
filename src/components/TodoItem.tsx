import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  loader?: boolean
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  loader,
}) => {
  const { title, completed, id: Id } = todo;
  const [isLoad, setIsLoad] = useState(loader);
  const onDelete = (id: number) => {
    setIsLoad(true);
    deleteTodo(id)
      .catch((error) => {
        setIsLoad(false);
        throw error;
      })
      .then(() => setIsLoad(false));
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', completed && 'completed')}
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
        data-cy="TodoDelete"
        onClick={() => onDelete(Id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', isLoad && 'is-active')}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

    </div>
  );
};
