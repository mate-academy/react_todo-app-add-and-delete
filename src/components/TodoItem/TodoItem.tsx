import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deleteTodo: (todoId: number) => void;
  isLoading: boolean,
  deletedTodoId: number[],
  onCompleteTodo: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  deleteTodo,
  // isLoading,
  deletedTodoId,
  onCompleteTodo,
}) => {
  const {
    id,
    title,
    completed,
  } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => onCompleteTodo(id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodo(id)}
      >
        ×
      </button>

      {/* <form>
        <input
          data-cy="TodoTitleField"
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          defaultValue="JS"
        />
      </form> */}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': deletedTodoId.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
