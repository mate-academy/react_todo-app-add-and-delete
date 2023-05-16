import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deletingId: number | null;
  onDeleteClick: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingId,
  onDeleteClick,
}) => {
  const { id, title, completed: isCompleted } = todo;

  const handleDelete = () => {
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
          // empty onChange to temporaly get rid of console error about checked without onChange
          onChange={() => {}}
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
          { 'is-active': id === 0 || id === deletingId },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
