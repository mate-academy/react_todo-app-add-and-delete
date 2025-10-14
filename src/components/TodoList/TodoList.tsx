/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (id: number) => void;
  deletingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDelete,
  deletingTodoIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        const isDeleting = deletingTodoIds.includes(todo.id);

        return (
          <div
            key={todo.id}
            className={`todo ${todo.completed ? 'completed' : ''}`}
            data-cy="Todo"
          >
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                readOnly
                data-cy="TodoStatus"
              />
            </label>

            <span className="todo__title" data-cy="TodoTitle">
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(todo.id)}
              disabled={isDeleting}
            >
              ×
            </button>

            {isDeleting && (
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            )}
          </div>
        );
      })}

      {tempTodo && (
        <div key={0} className="todo loading" data-cy="Todo">
          <label className="todo__status-label">
            <input type="checkbox" className="todo__status" disabled />
          </label>

          <span className="todo__title" data-cy="TodoTitle">
            {tempTodo.title}
          </span>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );
};
