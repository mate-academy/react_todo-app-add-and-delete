import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  todo: Todo;
  onDeleteTodo: (id: number) => void;
  allTodosDeleting: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  allTodosDeleting,
}) => {
  const [isDeleting, SetIsDeleting] = useState<boolean>(false);

  const isActiveStatus =
    !todo.id || isDeleting || (allTodosDeleting && todo.completed);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed }, 'item-enter-done')}
    >
      <label className="todo__status-label">
        <input
          aria-label="todo__status"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {}}
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          SetIsDeleting(true);
          onDeleteTodo(todo.id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isActiveStatus,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
