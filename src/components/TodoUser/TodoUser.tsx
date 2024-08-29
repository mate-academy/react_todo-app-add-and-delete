/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo.js';
import cn from 'classnames';

type Props = {
  todo: Todo;
  onDelete: (id: number) => void;
  processedId: number[];
  handleCompletedStatus: (id: number) => void;
};

export const TodoUser: React.FC<Props> = ({
  todo,
  onDelete,
  handleCompletedStatus,
  processedId,
}) => {
  const [isEditingTodo, setIsEditingTodo] = useState<Todo | null>(null);

  const { id, completed, title } = todo;

  const processedTodos = processedId?.includes(id) || id === 0;

  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current && isEditingTodo) {
      todoField.current.focus();
    }
  }, [isEditingTodo]);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: completed })}
      key={id}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => handleCompletedStatus(id)}
        />
      </label>

      {isEditingTodo?.id === id ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={isEditingTodo.title}
            onChange={event =>
              setIsEditingTodo({ ...todo, title: event.target.value })
            }
            onBlur={() => setIsEditingTodo(null)}
            ref={todoField}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEditingTodo(todo)}
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
          'is-active': processedTodos,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
