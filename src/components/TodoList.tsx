import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todos: Todo[];
  deletingTodos: number[];
  onDelete: (todoId: number) => void;
  isTemp?: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  deletingTodos,
  onDelete,
  isTemp = false,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => {
      const isDeleting = deletingTodos.includes(todo.id);

      return (
        <div
          key={todo.id}
          data-cy="Todo"
          className={classNames('todo', {
            completed: todo.completed,
            deleting: isDeleting,
          })}
        >
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={todo.completed}
              readOnly
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo.id)}
            disabled={isTemp}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={classNames('modal overlay', {
              'is-active': isDeleting,
            })}
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      );
    })}
  </section>
);
