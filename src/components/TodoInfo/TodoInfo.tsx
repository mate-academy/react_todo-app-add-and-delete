import { useState, FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  getTodoId: (id: number) => void,
  removesTodo: (id: number[]) => void,
  loadingTodos: number[],
}

export const TodoInfo: FC<Props> = ({
  todo,
  getTodoId,
  removesTodo,
  loadingTodos,
}) => {
  const [isEditing] = useState(false);

  const {
    title,
    completed,
    id,
  } = todo;

  return (
    <div
      className={cn('todo', {
        completed,
      })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={() => {
            getTodoId(todo.id);
          }}
        />
      </label>

      {isEditing ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            defaultValue="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span
            className="todo__title"
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            onClick={() => {
              getTodoId(id);
              removesTodo([id]);
            }}
          >
            ×
          </button>
        </>
      )}

      {/* 'is-active' class puts this modal on top of the todo */}
      <div
        className={cn('modal overlay', {
          'is-active': loadingTodos.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
