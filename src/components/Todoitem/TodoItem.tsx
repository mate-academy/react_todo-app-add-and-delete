import React from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TempTodo } from '../../types/TempTodo';

interface Props {
  todo: Todo | TempTodo
  onButtonRemove: (id: number) => void
  loadingTodoIds: number[]
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onButtonRemove,
  loadingTodoIds,
}) => {
  const isLoading = todo.id === 0 || loadingTodoIds.includes(todo.id);

  return (
    <div
      className={cn(
        'todo',
        { completed: todo?.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
        />
      </label>
      <span className="todo__title">{todo?.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onButtonRemove(todo.id)}
      >
        ×
      </button>

      <div className={cn(
        'modal',
        'overlay',
        { 'is-active': isLoading },
      )}
      >
        <div
          className="modal-background has-background-white-ter"
        />

        <div className="loader" />
      </div>

    </div>
  );
};
