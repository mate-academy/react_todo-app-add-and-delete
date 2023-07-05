/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  removeTodo: (arg: number) => void;
  removingTodoId: number;
}

export const ContentMain: React.FC<Props> = ({
  todos,
  tempTodo,
  removeTodo,
  removingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {todos.map(({ id, completed, title }) => (
        <div
          key={id}
          className={classNames('todo', {
            completed,
            // 'is-active': setIsLoading,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{title}</span>

          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            onClick={() => removeTodo(id)}
          >
            ×
          </button>

          {/* overlay will cover the todo while it is being updated */}
          <div className={classNames('modal overlay', {
            'is-active': removingTodoId === id,
          })}
          >
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      ))}
      {tempTodo && (
        <div
          className={classNames('todo', {
            completed: tempTodo.completed,
          })}
        >
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
              checked
            />
          </label>

          <span className="todo__title">{tempTodo.title}</span>

          {/* Remove button appears only on hover */}
          <button type="button" className="todo__remove">×</button>

          {/* overlay will cover the todo while it is being updated */}
          <div className="modal overlay is-active">
            <div
              className="modal-background has-background-white-ter"
            />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
