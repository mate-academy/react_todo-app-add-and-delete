/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onCompletedChange?: (todoId: number) => void,
  onDeleteTodo: (todoId: number) => void,
  isLoading: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onCompletedChange = () => {},
  onDeleteTodo,
  isLoading,
}) => {
  const checkHandler = (event: React.FormEvent<HTMLInputElement>) => {
    event.stopPropagation();
    onCompletedChange(todo.id);
  };

  const onDeleteClick = () => {
    onDeleteTodo(todo.id);
  };

  return (
    <div
      className={classNames('todo',
        { completed: todo.completed })}
      data-cy="Todo"
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={checkHandler}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={onDeleteClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay',
          { 'is-active': isLoading })}
      >
        <div
          className="modal-background
           has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
