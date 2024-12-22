/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { USER_ID } from '../api/todos';

interface Props {
  todo: Todo;
  onUpdate?: (v: Todo) => void;
  onDelete?: (n: number) => void;
  loader: boolean;
  massLoader?: boolean;
  tempTodo?: Todo | null;
  onErrorMessage?: (v: string) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo: { id, title, completed },
  onUpdate = () => {},
  onDelete = () => {},
  loader,
  massLoader = false,
  tempTodo = null,
  onErrorMessage = () => {},
}) => {
  const [activeTodoId, setActiveTodoId] = useState<number | null>(null);
  const handleChangeCheckbox = async () => {
    setActiveTodoId(id);
    await onUpdate({
      id,
      userId: USER_ID,
      title,
      completed: !completed,
    });
    setActiveTodoId(null);
  };

  const handleDelete = async () => {
    try {
      setActiveTodoId(id);

      await onDelete(id);
    } catch {
      setActiveTodoId(null);
      onErrorMessage('Unable to delete a todo');
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo item-enter-done', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCheckbox}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (loader && activeTodoId === id) || massLoader || tempTodo,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
