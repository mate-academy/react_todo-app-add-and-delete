import React from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';

interface Props {
  loadingTodoIds: number[];
  todo: Todo;
  onDelete: (todoId: number) => void;
  onToggleTodo: (
    event: React.ChangeEvent<HTMLInputElement>,
    todoId: number,
  ) => void;
}

export const TodoItem: React.FC<Props> = ({
  loadingTodoIds,
  todo,
  onDelete,
  onToggleTodo,
}) => {
  const isBeingEdited = false; // This variable will be realised in the next task

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={event => onToggleTodo(event, todo.id)}
        />
      </label>

      {isBeingEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
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
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        {/* eslint-disable-next-line max-len */}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
