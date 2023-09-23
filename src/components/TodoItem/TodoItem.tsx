import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  deletePost: (id: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  deletePost,
}) => {
  const [loadingForDelete] = useState(false);

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
        {(loadingForDelete) && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </span>

      <button
        onClick={() => {
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
