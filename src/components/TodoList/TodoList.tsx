import React from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null,
  onDeleteTodo: (value: number) => void,
  todosIdInProcess: number[],
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  todosIdInProcess,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        const { id, title, completed } = todo;

        return (
          <div
            key={id}
            className={classnames('todo',
              {
                completed,
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
              onClick={() => {
                onDeleteTodo(id);
              }}
            >
              ×
            </button>

            {/* overlay will cover the todo while it is being updated */}
            <div className={classnames('modal overlay', {
              'is-active': todosIdInProcess.includes(id),
            })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
      {tempTodo && (
        <div
          key={tempTodo.id}
          className={classnames('todo',
            {
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
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
