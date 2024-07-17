/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

interface Props {
  todo: TodoType;
  onDelete: (id: number) => void;
  onEdit: (id: number, data: Partial<TodoType>) => void;
}

export const Todo: FC<Props> = ({ todo, onDelete, onEdit }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      await onDelete(todo.id);
    } catch {
      // eslint-disable-next-line no-console
      console.log('Erroro deleting todo');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (data: Partial<TodoType>) => {
    try {
      setLoading(true);
      await onEdit(todo.id, data);
    } catch {
      // eslint-disable-next-line no-console
      console.log('Error editing todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => handleEdit({ completed: !todo.completed })}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
