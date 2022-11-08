import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  visibleTodos: Todo[];
};

export const TodoList: React.FC<Props> = ({ visibleTodos }) => (
  <section className="todoapp__main" data-cy="TodoList">
    {visibleTodos.map(({ id, title, completed }) => {
      return (
        <div
          data-cy="Todo"
          key={id}
          className={classNames(
            'todo',
            { completed },
          )}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">{title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
          >
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      );
    })}
  </section>
);
