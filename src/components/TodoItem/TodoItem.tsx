import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo,
  loadingTodosId: number[],
  handleDeleteTodo: (todoId: number) => void
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  loadingTodosId,
  handleDeleteTodo,
}) => {
  const { id, completed, title } = todo;

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': loadingTodosId
            .filter(todoId => id === todoId).length,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
