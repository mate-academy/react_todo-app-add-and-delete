/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import cn from 'classnames';
import { Todo } from '../types/Todo';
import { Processing } from '../types/Processing';

type Props = {
  todo: Todo;
  onDelete: (value: number) => Promise<void>;
  isProcessing: Processing;
  setIsProcessing: React.Dispatch<React.SetStateAction<Processing>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  isProcessing,
  setIsProcessing,
}) => {
  const onDeleteHandle = (todoId: number) => {
    setIsProcessing(prev => ({ ...prev, deleting: [todo.id] }));
    onDelete(todoId).finally(() =>
      setIsProcessing(prev => ({ ...prev, deleting: [] })),
    );
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      {!isProcessing.editing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() =>
            setIsProcessing(prev => ({ ...prev, editing: todo.id }))
          }
        >
          {todo.title}
        </span>
      ) : isProcessing.editing === todo.id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        ''
      )}

      {/* Remove button appears only on hover */}
      {isProcessing.editing === todo.id || (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            onDeleteHandle(todo.id);
          }}
        >
          ×
        </button>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            isProcessing.deleting.includes(todo.id) ||
            isProcessing.submitting === todo.id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
