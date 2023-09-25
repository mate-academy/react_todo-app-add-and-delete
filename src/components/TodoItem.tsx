import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDelete?: (id: number) => void;
  loadingTodosIds: number[],
  isLoaderActive: boolean,
};

export const TodoItem: React.FC<Props> = React.memo((({
  todo,
  onDelete = () => { },
  loadingTodosIds,
  isLoaderActive,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        data-cy="TodoDelete"
        type="button"
        className="todo__remove"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': loadingTodosIds.includes(todo.id) && isLoaderActive })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}));
