import classNames from 'classnames';
import React, { useState } from 'react';
import { deleteTodo } from '../api/todos';
import { Todo } from '../types/Todo';

export type Props = {
  todo: Todo,
  showLoader?: boolean,
  removeTodo: (todoId: number) => void,
  showErrorBanner: (errorMsg: string) => void,
};

export const TodoRow: React.FC<Props> = ({
  todo, showLoader = false, removeTodo, showErrorBanner,
}) => {
  const [deletionProcess, setDeletionProcess] = useState(false);

  return (
    <div
      data-cy="Todo"
      className={
        classNames('todo', { completed: todo.completed })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          setDeletionProcess(true);
          deleteTodo(todo.id)
            .then(() => removeTodo(todo.id))
            .catch(() => showErrorBanner('Unable to delete a todo'))
            .finally(() => setDeletionProcess(false));
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay',
          { 'is-active': showLoader || deletionProcess })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
