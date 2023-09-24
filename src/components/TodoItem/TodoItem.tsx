import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deletePost: (id: number) => void,
  key: number,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletePost,
  key,
}) => {
  const [loading, setLoading] = useState(false);
  const isTodoAdded = todo.id === key;

  // eslint-disable-next-line no-console
  console.log(isTodoAdded);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
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
        <div
          data-cy="TodoLoader"
          className={cn('modal overlay',
            { 'is-active': loading || isTodoAdded })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </span>

      <button
        onClick={() => {
          setLoading(true);
          setTimeout(() => {
            deletePost(todo.id);
          }, 200);
        }}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>
    </div>
  );
};
