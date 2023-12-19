import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  deleteTodo: (id: number) => void;
  isProcessing: Todo | null;
};

export const TodoItem: React.FC<TodoItemProps> = (
  { todo, deleteTodo, isProcessing },
) => {
  return (
    <div
      key={todo.id}
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
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      {isProcessing && (
        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': isProcessing && isProcessing.id === todo.id,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
