import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  isDeleting?: boolean;
  onRemoving: (todoId: number) => void;
};

export const TodoItem: React.FC<Props> = memo((props) => {
  const {
    todo, isAdding, isDeleting, onRemoving,
  } = props;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onRemoving(todo.id)}
      >
        ×
      </button>

      <Loader isLoading={isAdding || isDeleting} />
    </div>
  );
});
