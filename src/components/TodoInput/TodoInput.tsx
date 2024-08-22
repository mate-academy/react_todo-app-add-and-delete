import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleDeleteTodoClick: (id: number) => void;
  isDeletedTodoHasLoader: boolean;
};

export const TodoInput: React.FC<Props> = ({
  todo,
  handleDeleteTodoClick,
  isDeletedTodoHasLoader,
}) => {
  const [deletedTodoId, setDeletedTodoId] = useState(0);
  const [isCompleted, setIsCompleted] = useState(todo.completed);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label" htmlFor={`input-${todo.id}`}>
        <input
          id={`input-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={() => setIsCompleted(prev => !prev)}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          handleDeleteTodoClick(todo.id);
          setDeletedTodoId(todo.id);
        }}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeletedTodoHasLoader && todo.id === deletedTodoId,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
