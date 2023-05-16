import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDeleteClick: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({ todo, onDeleteClick }) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const { id, title, completed: isCompleted } = todo;

  const handleDelete = () => {
    setIsDeleted(true);
    onDeleteClick(id);
  };

  const isEdited = false;

  return (
    <div
      className={classNames(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          readOnly={isCompleted}
        />
      </label>

      {!isEdited ? (
        <>
          <span className="todo__title">
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
          />
        </form>
      )}

      <div
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': id === 0 || isDeleted },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
