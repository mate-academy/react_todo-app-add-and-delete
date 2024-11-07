import { FC } from 'react';
import { Todo } from '../../../types/Todo';
import cn from 'classnames';
import { useDeleteTodo } from '../../../hooks/useDeleteTodo';

interface TodoItemProps {
  todo: Todo;
  isLoading?: boolean;
}

export const TodoItem: FC<TodoItemProps> = ({ todo, isLoading = false }) => {
  const { completed, id, title } = todo;

  const { isDeleting, handleDeleteTodo } = useDeleteTodo();

  return (
    <div data-cy="Todo" className={cn('todo', { completed })}>
      {/* eslint-disable jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {}}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title.trim()}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
