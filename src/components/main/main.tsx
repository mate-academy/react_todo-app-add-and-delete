import classNames from 'classnames';
import React from 'react';
import { Todo } from '../../types/Todo';

interface Props {
  visibleTodos: Todo[];
  handleDelete: (todo: Todo) => void;
  loadingIds: number[];
}

export const TodoMain: React.FC<Props> = ({
  visibleTodos,
  handleDelete,
  loadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return (
          <div
            data-cy="Todo"
            className={classNames('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                aria-label="Toggle todo status"
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
              />
            </label>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => {}}
            >
              {todo.title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => handleDelete(todo)}
            >
              ×
            </button>
            <div
              data-cy="TodoLoader"
              className={classNames('modal overlay', {
                'is-active': loadingIds.includes(todo.id),
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
};
