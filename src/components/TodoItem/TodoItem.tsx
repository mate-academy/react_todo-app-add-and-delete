import cn from 'classnames';

import { Todo } from '../../types/Todo';

type Props = {
  onDelete: (value: number) => void,
  onCheckedToggle: (value: number) => void,
  isTodoLoading: Todo | null,
  todo: Todo,
};

export const TodoItem: React.FC<Props> = ({
  onDelete,
  onCheckedToggle,
  isTodoLoading,
  todo,
}) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', {
          'todo completed': todo.completed,
        })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onClick={() => {
              onCheckedToggle(todo.id);
            }}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isTodoLoading?.id === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
