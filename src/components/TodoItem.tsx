import React, {
  FormEvent, useEffect, useRef, useState,
} from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  deleteTodo: (value: number) => void;
  updateTodo: (value: number, value2: Partial<Todo>) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deleteTodo,
  updateTodo,
  isLoading,

}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState<string>(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const saveUpdates = () => {
    setIsEditing(false);
    if (updatedTitle !== todo.title) {
      updateTodo(todo.id, { title: updatedTitle });
    }

    if (!updatedTitle.trim()) {
      deleteTodo(todo.id);
    }
  };

  const onSubmitHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEditing(false);

    saveUpdates();
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setIsEditing(false);
      setUpdatedTitle(todo.title);
    }
  };

  return (
    <>
      <div
        className={cn('todo', {
          completed: todo.completed,
        })}
        onDoubleClick={() => setIsEditing(true)}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            onChange={() => updateTodo(
              todo.id,
              { completed: !todo.completed },
            )}
          />
        </label>
        {isEditing ? (
          <form onSubmit={onSubmitHandler}>
            <input
              ref={inputRef}
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              onBlur={saveUpdates}
              onKeyUp={handleKeyUp}
            />
          </form>
        ) : (
          <span className="todo__title">
            {todo.title}
          </span>
        )}

        <button
          type="button"
          className="todo__remove"
          onClick={() => deleteTodo(todo.id)}
        >
          ×
        </button>

        <div
          className={cn('modal overlay', {
            'is-active': isLoading,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
