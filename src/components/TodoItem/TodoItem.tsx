/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { TodoViewModel } from '../../types/Todo';
import cn from 'classnames';
import { useClickOutside } from '../../hooks/useClickOutside';

type Props = {
  todo: TodoViewModel;
  onDelete?: (id: number) => void;
};

export function TodoItem({ todo, onDelete }: Props) {
  const [title, setTitle] = useState(todo.title);
  const [isChecked, setIsChecked] = useState(todo.completed);
  const [isEditing, setIsEditing] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const inputRef = useClickOutside<HTMLInputElement>(() => {
    setIsEditing(false);
  });

  async function handleDelete(id: number) {
    if (!onDelete) {
      return;
    }

    setDisabled(true);
    try {
      await onDelete(id);
    } finally {
      setDisabled(false);
    }
  }

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isChecked })}>
      <label className="todo__status-label" htmlFor={`todo-${todo.id}`}>
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isChecked}
          onChange={e => setIsChecked(e.target.checked)}
        />
      </label>
      {isEditing ? (
        <form>
          <input
            ref={inputRef}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditing(true)}
          >
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => handleDelete(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': todo?.isLoading || disabled,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
}
