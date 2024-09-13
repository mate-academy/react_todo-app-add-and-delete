/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import React, { memo } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onToggle?: (toggledTodo: Todo) => void;
  isTodoEdited?: boolean;
  isTodoLoading?: boolean;
  onDelete?: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = memo(function TodoItem({
  todo,
  onToggle = () => {},
  isTodoEdited = false,
  isTodoLoading = false,
  onDelete = () => {},
}) {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={e => {
            onToggle({
              ...todo,
              completed: e.target.checked,
            });
          }}
        />
      </label>

      {isTodoEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
          />
        </form>
      ) : (
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>
      )}

      {!isTodoEdited && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
