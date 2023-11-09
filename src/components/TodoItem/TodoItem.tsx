/* eslint-disable no-console */
import React from 'react';
import { Todo } from '../../types/Todo';

type TodoItemProps = {
  todo: Todo;
  isTemporary: boolean;
  onDelete: (todoId: number) => void;
  isDeleting: boolean;
};

export const TodoItem = React.memo<TodoItemProps>(
  ({
    todo, isTemporary, onDelete, isDeleting,
  }) => {
    console.log('item is temporary now', isTemporary);
    console.log('Rendering TodoItem');

    const itemClasses = `todo ${isTemporary ? 'temp-item' : ''}`;

    return (
      <div data-cy="Todo" className={itemClasses}>
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={todo.completed}
            readOnly // no change handler yet
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

        {(isTemporary || isDeleting) && (
          <div data-cy="TodoLoader" className="modal overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.todo.id === nextProps.todo.id
      && prevProps.todo.completed === nextProps.todo.completed
      && prevProps.todo.title === nextProps.todo.title
      && prevProps.isTemporary === nextProps.isTemporary
      && prevProps.isDeleting === nextProps.isDeleting
    );
  },
);
