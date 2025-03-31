import { useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete?: (v: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete, isLoading }) => {
  const [deletedTodoId, setDeletedTodoId] = useState(0);

  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            defaultChecked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            onDelete?.(todo.id);
            setDeletedTodoId(todo.id);
          }}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoading && deletedTodoId === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {/* This todo is being edited */}
      {/* <div data-cy="Todo" className="todo">
        <label className="todo__status-label" htmlFor="StatusID3">
          <input
            id="StatusID3"
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label> */}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>

        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
    </>
  );
};
