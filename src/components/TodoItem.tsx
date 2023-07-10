import { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  onDelete: (todoId: number) => void;
  onCheck: (id: number, status: boolean) => void;
  loadingIds: number[];
}

export const TodoItem: FC<Props> = ({
  todo,
  onCheck,
  onDelete,
  loadingIds,
}) => {
  const isActive = loadingIds.includes(todo.id);

  return (
    <div
      key={todo.id}
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onCheck(todo.id, !todo.completed)}
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div className={cn('modal overlay',
        { 'is-active': isActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
