import classNames from 'classnames';
import React from 'react';

import { useTodos } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
};

export const TodoListItem: React.FC<Props> = ({ todo }) => {
  const {
    toggleTodo,
    deletingIds,
    deleteTodo,
  } = useTodos();

  const { title, completed, id } = todo;

  const handleToggleTodo = () => {
    toggleTodo(id);
  };

  const handleDeleteTodo = () => {
    deleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          data-cy="TodoStatus"
          className="todo__status"
          checked={completed}
          onChange={handleToggleTodo}
        />
      </label>

      <span
        className="todo__title"
        data-cy="TodoTitle"
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': deletingIds.includes(todo.id),
        })}
        data-cy="TodoLoader"
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
