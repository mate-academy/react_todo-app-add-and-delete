import React, { memo } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

interface Props {
  todo: Todo,
  onDeleteTodo: (todoId: number) => Promise<any>;
  isDeleting: boolean,
}

export const TodoItem: React.FC<Props> = memo(({
  todo,
  onDeleteTodo,
  isDeleting,
}) => {
  const isLoading = todo.id === 0 || isDeleting;

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      <Loader isLoading={isLoading} />

    </div>
  );
});
