/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';

type Props = {
  todo: Todo;
  handleCompletedStatus: (todoId: number) => void;
  onDelete: (todoId: number) => void;
  processedTodosIds: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleCompletedStatus,
  onDelete,
  processedTodosIds,
}) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const editTodoField = useRef<HTMLInputElement>(null);

  const { id, title, completed } = todo;

  const isTodoProcessing = processedTodosIds.includes(id) || id === 0;

  useEffect(() => {
    if (editTodoField.current && editingTodo) {
      editTodoField.current.focus();
    }
  }, [editingTodo]);

  return (
    <div
      data-cy="Todo"
      key={id}
      className={cn('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompletedStatus(id)}
        />
      </label>

      {editingTodo?.id === id ? (
        <form>
          <input
            ref={editTodoField}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={editingTodo.title}
            onChange={event =>
              setEditingTodo({ ...todo, title: event.target.value })
            }
            onBlur={() => setEditingTodo(null)}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditingTodo(todo)}
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

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isTodoProcessing })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
