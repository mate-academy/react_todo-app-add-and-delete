/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  setCompleted: (completed: boolean) => void;
  tempTodo: Todo | null;
  onDelete: (todoId: number) => void;
  idOfDeletedTodo: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  setCompleted,
  tempTodo,
  onDelete,
  idOfDeletedTodo,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(({ id, title, completed }) => (
      <div
        key={id}
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={event => setCompleted(event.target.checked)}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal', 'overlay', {
            'is-active': idOfDeletedTodo.includes(id),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    ))}

    {tempTodo && (
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {tempTodo?.title}
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    )}
  </section>
);
