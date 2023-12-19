import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  onDeleteTodo?: (todoId: number) => void;
  processingTodoIds: number[];
}

export const SingleTodo: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  processingTodoIds,
}) => {
  const {
    title, id, completed,
  } = todo;

  const handleDelete = () => {
    if (!onDeleteTodo) {
      return;
    }

    onDeleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processingTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
