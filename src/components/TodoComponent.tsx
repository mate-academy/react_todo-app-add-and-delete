/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  key: number;
  todo: Todo;
  onCheck: (updater: (prevTodos: Todo[]) => Todo[]) => void;
  onDelete: (todo: Todo[]) => void;
  completedTodos: number[] | null;
};

export const TodoComponent: React.FC<Props> = ({
  key,
  todo,
  onCheck,
  onDelete,
  completedTodos,
}) => {
  return (
    <div
      key={key}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label htmlFor={`todo-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {
            onCheck((prevTodos: Todo[]) =>
              prevTodos.map(item =>
                item.id === todo.id
                  ? { ...item, completed: !item.completed }
                  : item,
              ),
            );
          }}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete([todo])}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': completedTodos?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
