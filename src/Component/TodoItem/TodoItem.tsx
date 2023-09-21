import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isLoading: boolean;
  editingTodoId?: number | null;
  setEditingTodoId?: (value: number | null) => void;
  onDelete?: (id: number) => void;
  isDeleting?: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo: { completed, id, title },
  isLoading,
  editingTodoId = null,
  setEditingTodoId = () => {},
  onDelete = () => {},
  isDeleting = [],
}) => {
  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      {editingTodoId === id ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue={title}
            onMouseLeave={() => setEditingTodoId(null)}
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
            onDoubleClick={() => setEditingTodoId(id)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            onClick={() => onDelete(id)}
          >
            ×
          </button>
        </>
      )}

      <div className={cn('modal overlay', {
        'is-active': isLoading || !id || isDeleting.includes(id),
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
