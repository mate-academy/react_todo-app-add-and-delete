import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo;
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  onDeleteTodo,
}) => (
  <div
    className={classNames('todo', {
      completed: todo.completed,
    })}
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
      />
    </label>

    <span className="todo__title">{todo.title}</span>
    <button
      type="button"
      className="todo__remove"
      onClick={() => {
        onDeleteTodo(todo.id);
      }}
    >
      ×
    </button>

    {isLoading && (
      <div className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    )}
  </div>
);
