import React from 'react';
import classNames from 'classnames';
import { ErrorType } from '../../Enums/Enums';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  setError: (p: ErrorType) => void;
  onDeleteTodo: (p: number) => void;
  isDeleting: boolean;
};

export const TodoInfo: React.FC<Props> = ({
  todo, setError, onDeleteTodo, isDeleting,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onClick={() => setError(ErrorType.Update)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
