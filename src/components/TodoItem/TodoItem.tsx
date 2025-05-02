/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

interface TodoProps {
  todo: Todo;
  isLoading: boolean;
  onChange: (todo: Todo, fieldsToUpdate: Partial<Todo>) => Promise<unknown>;
  onDelete: (todoId: Todo) => void;
}

export const TodoItem = ({
  todo,
  isLoading,
  onChange,
  onDelete,
}: TodoProps) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editValue, setEditValue] = useState('');
  const { title, completed } = todo;

  const handleTitleClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    currentTodo: Todo,
  ) => {
    if (event.detail === 2) {
      setIsEdit(true);
      setEditValue(currentTodo.title);
    }
  };

  const handleSubmit = (currentTodo: Todo) => {
    onChange(currentTodo, { title: editValue })
      .then(() => setIsEdit(false))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error(error);
      });
  };

  const handleEditSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    currentTodo: Todo,
  ) => {
    event.preventDefault();
    handleSubmit(currentTodo);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed === true}
          onChange={() => onChange(todo, { completed: !completed })}
        />
      </label>
      {isEdit ? (
        <form
          onSubmit={event => {
            handleEditSubmit(event, todo);
          }}
        >
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editValue}
            // autoFocus
            onChange={event => setEditValue(event.target.value)}
            onBlur={() => handleSubmit(todo)}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                setIsEdit(false);
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={event => handleTitleClick(event, todo)}
          >
            {title}
          </span>
          {/* Remove button appears only on hover */}
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todo)}
          >
            ×
          </button>
        </>
      )}
      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
