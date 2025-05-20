/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoLoader } from '../TodoLoader/TodoLoader';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isEditing?: boolean;
  isLoading?: boolean;
  isDeleting?: boolean;
  onDelete: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  isEditing,
  isLoading,
  isDeleting,
  onDelete,
}) => {
  const loading = isLoading || isDeleting;

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            disabled={isLoading}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            data-cy="TodoDelete"
            type="button"
            className="todo__remove"
            disabled={isLoading}
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <TodoLoader isActive={loading} />
    </div>
  );
};
