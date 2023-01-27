import React, { memo, useState } from 'react';
import cn from 'classnames';
import { TempTodo, Todo } from '../../types/Todo';

type Props = {
  todo: Todo | TempTodo;
  onDelete?: (id: number) => void;
  deletingTodoId?: number | null;
  isLoading?: boolean;
};
export const TodoInfo:React.FC<Props> = memo(
  ({
    onDelete,
    todo,
    deletingTodoId,
    isLoading,
  }) => {
    const [isEditing] = useState(false);

    const isLoaderActive = (deletingTodoId === todo.id)
      || todo.id === 0
      || (isLoading && todo.completed);

    return (
      <div
        data-cy="Todo"
        className={cn('todo',
          { completed: todo.completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly
          />
        </label>

        {isEditing ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={todo.title}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
            >
              {todo.title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => {
                if (onDelete) {
                  onDelete(todo.id);
                }
              }}
            >
              ×
            </button>
          </>
        )}
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isLoaderActive,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    );
  },
);
