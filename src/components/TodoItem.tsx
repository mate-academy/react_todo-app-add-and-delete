import classNames from 'classnames';
import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  handleDeleteCurrentTodo: (value: number) => void;
  deletingTodoId: number | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteCurrentTodo,
  deletingTodoId,
}) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
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
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteCurrentTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', { 'is-active': deletingTodoId === todo.id },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
