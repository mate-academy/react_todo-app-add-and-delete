import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isloadingId: number;
  onDelete: (todoId: number) => void;
}

export const TodoItem: FC<Props> = ({
  todo,
  isloadingId,
  onDelete: handleDeleteTodo,
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
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isloadingId === todo.id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
