/* eslint-disable react/display-name */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { memo } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

interface Props<T> {
  todo: T;
  isActive: boolean;
  removeTodo?: () => void;
}

export const TodoItem = memo((props: Props<Todo>) => {
  const { todo, isActive, removeTodo } = props;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        'temp-item-enter temp-item-enter-active': todo.id === 0,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={removeTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActive,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        {isActive && <div className="loader" />}
      </div>
    </div>
  );
});
