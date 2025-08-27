import React, { useMemo } from 'react';
import cn from 'classnames';
import { Todo } from '../../api/todos';

type Props = {
  todo: Todo;
  loading?: boolean;
  disableActions?: boolean;
  onDelete: (todo: Todo) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  loading = false,
  disableActions = false,
  onDelete,
}) => {
  const statusId = useMemo(() => `status-${todo.id}`, [todo.id]);

  return (
    <li className={cn('todo', { completed: todo.completed })} data-cy="Todo">
      {/* Loader should always exist, only active when loading */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': loading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>

      <label className="todo__status-label" htmlFor={statusId}>
        <input
          id={statusId}
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          readOnly
        />
        <span className="visually-hidden">
          Mark todo as {todo.completed ? 'incomplete' : 'complete'}
        </span>
      </label>

      <span className="todo__title" data-cy="TodoTitle">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        aria-label="Delete todo"
        disabled={disableActions || loading || todo.id === 0}
        onClick={() => onDelete(todo)}
      />
    </li>
  );
};
