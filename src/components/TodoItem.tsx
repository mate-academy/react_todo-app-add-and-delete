import React, { useState, KeyboardEvent } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { updateTodo, deleteTodo } from '../api/todos';
import { Loader } from './Loader';

type Props = {
  todo: Todo & { isTemp?: boolean };
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  loadingIds: number[];
  addLoading: (id: number) => void;
  removeLoading: (id: number) => void;
  setError: (message: string | null) => void;
  onDelete?: () => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  loadingIds,
  addLoading,
  removeLoading,
  setError,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);

  const isLoading = loadingIds.includes(todo.id);
  const showLoader = isLoading || todo.isTemp;

  const handleToggle = async () => {
    addLoading(todo.id);
    try {
      const updated = await updateTodo(todo.id, { completed: !todo.completed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      setError('Unable to update a todo');
    } finally {
      removeLoading(todo.id);
    }
  };

  const handleDelete = async () => {
    addLoading(todo.id);
    try {
      await deleteTodo(todo.id);
      setTodos(prev => prev.filter(t => t.id !== todo.id));
      onDelete?.();
    } catch {
      setError('Unable to delete a todo');
    } finally {
      removeLoading(todo.id);
    }
  };

  const handleSave = async () => {
    const trimmed = editValue.trim();

    if (trimmed === todo.title) {
      return setIsEditing(false);
    }

    if (!trimmed) {
      return handleDelete();
    }

    addLoading(todo.id);
    try {
      const updated = await updateTodo(todo.id, { title: trimmed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      setIsEditing(false);
    } catch {
      setError('Unable to update a todo');
    } finally {
      removeLoading(todo.id);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSave();
    }

    if (event.key === 'Escape') {
      setEditValue(todo.title);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
        editing: isEditing,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          disabled={isLoading || todo.isTemp}
          onChange={handleToggle}
        />
        <span className="sr-only">Toggle todo completion</span>
      </label>

      {!isEditing ? (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => {
            setIsEditing(true);
            setEditValue(todo.title);
          }}
        >
          {todo.title}
        </span>
      ) : (
        <input
          type="text"
          className="todo__title-field"
          value={editValue}
          disabled={isLoading}
          onChange={ev => setEditValue(ev.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
        />
      )}

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
        disabled={isLoading || isEditing}
      >
        ×
      </button>

      <Loader isActive={showLoader} />
    </div>
  );
};
