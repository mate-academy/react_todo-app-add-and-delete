import React, { useState } from 'react';
import classnames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: CallableFunction,
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleTodoRemove = () => {
    setIsLoading(true);
    onDelete(todo.id || 0);
  };

  return (
    <div
      data-cy="Todo"
      className={classnames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          handleTodoRemove();
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classnames(
            'modal',
            'overlay',
            { 'is-active': isLoading },
          )
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
