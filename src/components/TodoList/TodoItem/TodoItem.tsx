import React from 'react';
import cn from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (id: number) => Promise<void>;
  activeTodoId: number;
};

export const TodoItem: React.FC<Props> = React.memo(({
  todo,
  onDelete,
  activeTodoId,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed: todo.completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': todo.id === activeTodoId },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
