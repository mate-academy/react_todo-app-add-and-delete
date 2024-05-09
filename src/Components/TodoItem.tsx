import React from 'react';
import { Loader } from './Loader';
import { deleteTodo } from '../api/todos';
import { Error } from '../types/Todo';

interface Props {
  id: number;
  title: string;
  completed: boolean;
  onToggle: () => void;
  setLoading: (setLoading: boolean) => void;
  setError: (setError: boolean) => void;
  setErrorType: (setErrorType: Error | null) => void;
  onDelete: (id: number) => void;
  loadingTodoId: number | null;
  loadingAddTodoId: number | null;
  setFocus: (setFocus: boolean) => void;
  setLoadingTodoId: (setLoadingTodoId: number | null) => void;
}

export const TodoItem: React.FC<Props> = ({
  id,
  title,
  completed,
  onToggle,
  setLoading,
  setError,
  setErrorType,
  onDelete,
  loadingTodoId,
  loadingAddTodoId,
  setFocus,
  setLoadingTodoId,
}) => {
  const showLoader = loadingTodoId === id || loadingAddTodoId === id;

  const handleDelete = async () => {
    setLoading(true);
    setLoadingTodoId(id);
    try {
      await onDelete(id);
      await deleteTodo(id);
      setLoadingTodoId(null);
      setFocus(true);
    } catch (err) {
      setError(true);
      setErrorType('delete');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      data-id={id}
      className={`todo ${completed ? 'completed' : ''}`}
    >
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={onToggle}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
        data-cy="TodoDelete"
        disabled={showLoader}
      >
        ×
      </button>
      <Loader loading={showLoader} />
    </div>
  );
};
