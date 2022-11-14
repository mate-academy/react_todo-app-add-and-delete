import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding: boolean;
  removeTodoFromServer: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  removeTodoFromServer,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
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
          removeTodoFromServer(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
