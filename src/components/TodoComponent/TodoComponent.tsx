import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type TodoType = {
  todo: Todo | null;
  isLoading: boolean;
  handleDeleteTodo: (todoId: number) => void;
  isTodoLoading?: boolean;
  deletingTodoId?: number | null,
};

export const TodoComponent: React.FC<TodoType> = ({
  todo,
  handleDeleteTodo,
  deletingTodoId,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo?.completed })}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>

      {false ? (
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
            {todo?.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDeleteTodo(todo?.id || 1)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': todo?.id === 0 || todo?.id === deletingTodoId })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
