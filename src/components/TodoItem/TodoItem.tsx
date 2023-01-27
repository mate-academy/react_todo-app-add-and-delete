import React, { memo } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

export type Props = {
  todo: Todo
  deletedTodo: (value: number) => void
  deletingTodoIds: number[]
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  deletedTodo,
  deletingTodoIds,
}) => {
  const isLoading = todo.id === 0 || deletingTodoIds.includes(todo.id);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo',
        { completed: todo.completed === true })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deletedTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
