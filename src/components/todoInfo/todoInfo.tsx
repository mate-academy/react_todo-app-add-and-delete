import React from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

interface TodoInfoProps {
  todo: Todo;
  deletedTodos?: number[];
  onDelete: (todoId: number) => void;
}

export const TodoInfo: React.FC<TodoInfoProps> = ({
  todo,
  deletedTodos,
  onDelete,
}) => {
  const checkboxId = `todo-status-${todo.id}`;

  const handleToggleTodo = () => {
    // This function will handle the toggle of the todo status
    // It should be implemented to update the todo status in the state or send a request to the server
    /* eslint-disable-next-line */
    console.log(`Toggling todo with id: ${todo.id}`);
  };

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label" htmlFor={checkboxId}>
        <input
          id={checkboxId}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleToggleTodo}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === 0 || deletedTodos?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
