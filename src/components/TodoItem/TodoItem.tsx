import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: number) => Promise<void>;
  onToggleTodoStatus: (todoId: number) => Promise<void>;
  isProcessing: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  onToggleTodoStatus,
  isProcessing,
}) => {
  const handleDelete = () => {
    if (isProcessing) {
      return;
    }

    onDeleteTodo(todo.id);
  };

  const handleToggle = () => {
    if (isProcessing) {
      return;
    }

    onToggleTodoStatus(todo.id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggle}
          aria-label={`Completed: ${todo.title}`}
          disabled={isProcessing}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={isProcessing}
      >
        ×
      </button>

      {isProcessing && (
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
