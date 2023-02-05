import classNames from 'classnames';
import { useContext } from 'react';
import { DeleteContext } from '../../context/DeleteContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed }, deleteTodo,
}) => {
  const { isDeleting, deletedId } = useContext(DeleteContext);
  const isProcessing = id === 0 || (isDeleting && deletedId === id);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          { 'is-active': isProcessing },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
