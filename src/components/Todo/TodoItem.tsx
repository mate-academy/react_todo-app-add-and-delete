import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  loading?: boolean;
  deleteTodo: (todoId: number) => void;
  updateTodo: (todoToUpdate: Todo) => void;
  editingTodosIds: number[];
  setEditingTodosIds: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading,
  deleteTodo,
  updateTodo,
  editingTodosIds,
  setEditingTodosIds,
}) => {
  const { title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTodosIds.includes(todo.id) && !loading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading, editingTodosIds, todo.id]);

  const handleDelete = () => {
    setIsDeleting(true);
    deleteTodo?.(todo.id);
  };

  const startEditing = () => {
    setEditingTodosIds(prevIds => [...prevIds, todo.id]);
    setEditedTitle(todo.title);
  };

  const cancelEditing = useCallback(() => {
    setEditedTitle(todo.title);
    setEditingTodosIds(prevIds => prevIds.filter(prevId => prevId !== todo.id));
  }, [todo.title, todo.id, setEditingTodosIds]);

  const handleEditing = (event: React.FormEvent) => {
    event?.preventDefault();
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmedTitle === '') {
      deleteTodo?.(todo.id);
    } else {
      updateTodo({
        ...todo,
        title: trimmedTitle,
      });
    }
  };

  const isLoading = isDeleting || loading;

  useEffect(() => {
    if (loading) {
      setIsDeleting(false);
    }
  }, [loading]);

  useEffect(() => {
    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        cancelEditing();
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [cancelEditing]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      onDoubleClick={startEditing}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            updateTodo({
              ...todo,
              completed: !todo.completed,
            });
          }}
        />
      </label>

      {editingTodosIds?.includes(todo.id) ? (
        <form onSubmit={handleEditing}>
          <input
            data-cy="TodoTitleField"
            style={{ paddingLeft: '16px' }}
            type="text"
            className="todo__title-field"
            placeholder="What needs to be done?"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
            onBlur={handleEditing} // ← перенесли сюда
            disabled={loading}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
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
        </>
      )}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
