import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  loadingTodo: number[];
}

export const TodoInfo: FC<Props> = ({
  todo: { id, completed, title },
  onRemoveTodo,
  loadingTodo,
}) => {
  const isLoadingTodo = loadingTodo.includes(id);

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onRemoveTodo(id)}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoadingTodo,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
