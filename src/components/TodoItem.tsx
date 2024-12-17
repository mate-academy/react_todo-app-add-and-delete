import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onDelete }) => {
  const isTemporary = todo.id === 0;

  return (
    <div data-cy="Todo" key={todo.id} className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
      { /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }
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

      {/* Remove button appears only on hover */}
      <button type="button" className="todo__remove" data-cy="TodoDelete" onClick={() => onDelete(todo.id)} disabled={isTemporary}>
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className={classNames('modal overlay', { 'is-active' : isTemporary || todo.isLoading })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  )
}
