import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { useEffect, useRef } from 'react';

type Props = {
  todo: Todo;
  isEditing: boolean;
  isLoading: boolean;
  editQuery: string;
  onOneTodoToggle?: (id: number) => void;
  onEditSubmit?: () => void;
  onEditQueryChange?: (newQuery: string) => void;
  onDoubleClick?: (id: number) => void;
  onTodoRemove?: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isEditing,
  isLoading,
  editQuery,
  onOneTodoToggle = () => {},
  onEditSubmit = () => {},
  onEditQueryChange = () => {},
  onDoubleClick = () => {},
  onTodoRemove = () => {},
}) => {
  const inputEditElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputEditElement.current) {
      inputEditElement.current.focus();
    }
  }, [isEditing]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onClick={() => onOneTodoToggle(todo.id)}
        />
      </label>

      {isEditing ? (
        <form
          onSubmit={event => {
            event.preventDefault();
            onEditSubmit();
          }}
        >
          <input
            ref={inputEditElement}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editQuery}
            onChange={event => onEditQueryChange(event.target.value)}
            onBlur={() => onEditSubmit()}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => onDoubleClick(todo.id)}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onTodoRemove(todo.id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
