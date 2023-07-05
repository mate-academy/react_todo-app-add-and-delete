import classNames from 'classnames';
import { FC } from 'react';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDoubleClick?: () => void;
  onClick?: (id: number) => void;
  isLoading: boolean,
}

export const TodoItem: FC<TodoItemProps> = (
  {
    todo, onDoubleClick, onClick, isLoading,
  },
) => {
  const onClickHandler = () => {
    onClick?.(todo.id);
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
      onDoubleClick={onDoubleClick}

    >
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" checked />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={onClickHandler}
      >
        ×

      </button>

      {isLoading
        && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
    </div>
  );
};
