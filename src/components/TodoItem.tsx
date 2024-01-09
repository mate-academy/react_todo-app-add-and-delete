import React from 'react';
import cn from 'classnames';
import { Todo } from '../types';

interface Props {
  todo: Todo
  handleTodoDelete: (id: number) => void
  isLoading: number | boolean
  tempTodo: Todo | null
}

export const TodoItem: React.FC<Props> = (props) => {
  const {
    todo,
    handleTodoDelete,
    isLoading,
    tempTodo,
  } = props;

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo.id === isLoading || todo.id === tempTodo?.id,
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
