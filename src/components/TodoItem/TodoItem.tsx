import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onRemoveTodo: (todoId: number) => void,
  loadingTodo: number[]
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onRemoveTodo,
  loadingTodo,
}) => {
  const isLoading = todo.id !== undefined && loadingTodo.includes(todo.id);

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => todo.id && onRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
