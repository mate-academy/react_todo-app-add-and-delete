import React from 'react';
import classNames from 'classnames';
import { Todo } from './types/Todo';

interface Props {
  todo: Todo;
  removeTodo: (todoIduserId: number) => void;
  loadingTodos: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  loadingTodos,
}) => {
  const handleDelete = () => {
    removeTodo(todo.id);
  };

  const isLoadingTodos = loadingTodos.includes(todo.id);

  return (
    <div className={classNames('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
      >
        x
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div className={classNames('modal overlay',
        { 'is-active': isLoadingTodos })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
