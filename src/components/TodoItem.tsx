/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todosToDelete?: number[];
  todo: Todo;
  onTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
  onUpdate: (data: Todo, id: number) => Promise<void>;
}

export const TodoItem: React.FC<Props> = ({
  todosToDelete,
  todo,
  onTodosToDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [isUpdating, setIsUpdating] = useState(false);

  const todoTitleUpdate = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoTitleUpdate.current?.focus();
  }, [isEditing, isUpdating]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleUpdate = ({ userId, completed, id }: Todo) => {
    setIsUpdating(true);

    onUpdate({ title: newTitle, userId, completed, id }, id)
      .then(() => {
        setIsEditing(false);
        setIsUpdating(false);
        setNewTitle(todo.title);
      })
      .catch(() => {
        setIsEditing(false);
        setIsUpdating(false);
        setNewTitle(todo.title);
      });
  };

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
    todoToUpdate: Todo,
  ) => {
    event.preventDefault();
    handleUpdate(todoToUpdate);
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
        />
      </label>

      {isEditing ? (
        <>
          <form onSubmit={event => handleSubmit(event, todo)}>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value={newTitle}
              onChange={handleChange}
              ref={todoTitleUpdate}
              onBlur={() => handleUpdate(todo)}
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={handleDoubleClick}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() =>
              onTodosToDelete(currentTodos => [...currentTodos, todo.id])
            }
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active':
            !todo.id || todosToDelete?.includes(todo.id) || isUpdating,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
