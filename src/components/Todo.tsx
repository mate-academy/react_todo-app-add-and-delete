import React from 'react';
import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  onDelete: (id: number) => void;
  isProcessed: boolean;
};

export const Todo: React.FC<Props> = ({ todo, onDelete, isProcessed }) => {
  return (
    <>
      <div
        data-cy="Todo"
        className={cn('todo', { completed: todo.completed })}
        key={todo.id}
      >
        <label className="todo__status-label">
          {' '}
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onDelete(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn('modal overlay', {
            'is-active': isProcessed,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>

      {false && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            {' '}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>

          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}

      {false && (
        <div data-cy="Todo" className="todo">
          <label className="todo__status-label">
            {' '}
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            Todo is being saved now
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </>
  );
};
