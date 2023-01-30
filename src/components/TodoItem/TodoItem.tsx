import React, { FC } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onRemoveTodo: (todoId: number) => void;
  isDeleting: boolean;
};

export const TodoItem: FC<Props> = React.memo((props) => {
  const {
    todo,
    onRemoveTodo,
    isDeleting,
  } = props;
  const isLoading = todo.id === 0 || isDeleting;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo', { completed: todo.completed },
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
        onClick={() => onRemoveTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
