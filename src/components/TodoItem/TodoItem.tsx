import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  deletingId: number | null;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletingId,
  onDelete,
}) => {
  const { id, title, completed: isCompleted } = todo;

  const handleDelete = () => {
    onDelete(id);
  };

  const isEdited = false;

  return (
    <div
      className={cn(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
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
        className={cn(
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
