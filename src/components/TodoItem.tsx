/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type TodoItemProps = {
  todo: Todo;
  todos: Todo[];
  activeTodoId: number | null;
  handleCheckTodo: (id: number) => void;
  removeTodo: (todo: Todo) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed, userId },
  todos,
  handleCheckTodo,
  removeTodo,
  activeTodoId,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        { completed: completed },
        { hidden: !todos.length },
      )}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            handleCheckTodo(id);
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          removeTodo({ id, title, completed, userId });
        }}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': activeTodoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
