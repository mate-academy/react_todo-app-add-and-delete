import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onRemoveTodo: (id: number) => void;
}

export const TodoTask: FC<Props> = ({
  todo,
  isLoading,
  onRemoveTodo,
}) => {
  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <>
        <span className="todo__title">{todo.title}</span>
        <button
          type="button"
          className="todo__remove"
          onClick={() => onRemoveTodo?.(todo.id)}
        >
          ×
        </button>
      </>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
