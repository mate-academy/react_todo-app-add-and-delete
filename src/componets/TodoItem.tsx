import cn from 'classnames';

import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isProcessing?: boolean;
  onDelete?: () => void;
};

export const TodoItem: React.FC<Props> = ({ todo, isProcessing, onDelete }) => {
  function handleDeleteClick() {
    onDelete?.();
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label aria-label="Mark todo as completed" className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {/* <form>
      <input
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={todo.title}
      />
    </form> */}

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', { 'is-active': isProcessing })}
      >
        <div
          className="
              modal-background
              has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
