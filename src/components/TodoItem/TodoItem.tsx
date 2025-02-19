import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  handleUpdate: (id: number, completed: boolean) => void;
  handleDelete: (id: number) => void;
  isSubmiting: boolean;
  loader: number;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleUpdate,
  handleDelete,
  isSubmiting,
  loader,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames(
        'todo',
        todo.completed ? 'completed' : 'item-enter-done',
      )}
    >
      <label className="todo__status-label" aria-label="Toggle todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => {
            handleUpdate(todo.id, todo.completed);
          }}
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
          handleDelete(todo.id);
        }}
        disabled={isSubmiting}
      >
        ×
      </button>
      <div
        key={todo.id}
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          loader === todo.id && 'is-active',
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
        {todo.title}
      </div>
    </div>
  );
};
