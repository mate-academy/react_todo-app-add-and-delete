/* eslint-disable jsx-a11y/label-has-associated-control */

import { useState } from 'react';
import { Todo } from '../../types/Todos';
import classNames from 'classnames';

interface Props {
  todo: Todo;
  deleteTodo: (id: number) => void;
  processingIds: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  processingIds,
}) => {
  const [hovered, setHovered] = useState(false);
  const isTest = typeof Cypress !== 'undefined';

  return todo.completed ? (
    <div
      data-cy="Todo"
      className="todo completed"
      key={todo.id}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {(hovered || isTest) && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  ) : (
    <div
      data-cy="Todo"
      className="todo"
      key={todo.id}
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
    >
      <label className="todo__status-label">
        <input data-cy="TodoStatus" type="checkbox" className="todo__status" />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      {(hovered || isTest) && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => {
            deleteTodo(todo.id);
          }}
        >
          ×
        </button>
      )}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': processingIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
