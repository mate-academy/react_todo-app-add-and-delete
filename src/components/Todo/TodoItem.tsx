import cn from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { Todo, TodoId } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  isEditing: boolean;
  onDelete: (todoId: TodoId) => Promise<boolean>;
  onChange: (newTodo: Todo) => Promise<boolean>;
  setEditingId: (id: TodoId | null) => void;
}

export const TodoItem: React.FC<Props> = React.memo(
  ({ todo, isLoading, isEditing, onDelete, onChange, setEditingId }) => {
    const { completed, id, title } = todo;

    const [newTitle, setNewTitle] = useState(todo.title);
    const titleFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isEditing && titleFieldRef.current) {
        titleFieldRef.current.focus();
      }
    }, [isEditing]);

    const toggleStatus = () => {
      onChange({ ...todo, completed: !todo.completed });
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const normalizedTitle = newTitle.trim();

      if (normalizedTitle === todo.title) {
        setEditingId(null);

        return;
      }

      if (!normalizedTitle) {
        const isSuccess = await onDelete(todo.id);

        if (isSuccess) {
          setEditingId(null);
        }

        return;
      }

      const isSuccess = await onChange({ ...todo, title: normalizedTitle });

      if (isSuccess) {
        setEditingId(null);
      }
    };

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Escape') {
        setNewTitle(todo.title);
        setEditingId(null);
      }
    };

    return (
      <li
        data-cy="Todo"
        className={cn('todo', {
          completed: completed,
        })}
      >
        <label className="todo__status-label" htmlFor={`${id}`}>
          <span className="is-sr-only">
            {completed ? 'Mark as incomplete' : 'Mark as complete'}
          </span>
          <input
            id={`${id}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
            onChange={toggleStatus}
          />
        </label>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input
              ref={titleFieldRef}
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              onKeyUp={handleKeyUp}
              onBlur={handleSubmit}
            />
          </form>
        ) : (
          <>
            <span
              data-cy="TodoTitle"
              className="todo__title"
              onDoubleClick={() => setEditingId(todo.id)}
            >
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={() => onDelete(id)}
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
      </li>
    );
  },
);

TodoItem.displayName = 'TodoItem';
