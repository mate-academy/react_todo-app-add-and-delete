/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { TodoLoader } from '../TodoLoader';

interface Props {
  todo: Todo;
  isSubmitting?: boolean;
  isLoading?: boolean;
  onDeleteTodo?: (todoId: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isSubmitting = false,
  onDeleteTodo = () => {},
}) => {
  const { title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <TodoLoader isSubmitting={isSubmitting} />
    </div>
  );
};
