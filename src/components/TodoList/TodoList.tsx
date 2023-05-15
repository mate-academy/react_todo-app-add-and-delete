import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  onRemove: (id: number) => void;
}

export const TodoList: React.FC<Props> = ({ todos, onRemove }) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => {
        const { title, completed, id } = todo;

        return (
          <div key={id} className={classNames('todo', { completed })}>
            <label className="todo__status-label">
              <input
                type="checkbox"
                className="todo__status"
                checked={!!completed}
              />
            </label>

            <span className="todo__title">{title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={() => onRemove(id)}
            >
              ×
            </button>

            <div className="modal overlay">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>

  );
};
