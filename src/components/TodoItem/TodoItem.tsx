import { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (id: number) => Promise<void>,
  isLoading?: boolean,
};

export const TodoItem: FC<Props> = ({
  todo,
  removeTodo,
  isLoading,
}) => {
  const [loadingStatus, setLoadingStatus] = useState(isLoading);

  const handleRemoveTodo = () => {
    setLoadingStatus(true);

    if (todo.id) {
      removeTodo(todo.id)
        .finally(() => {
          setLoadingStatus(false);
        });
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed: todo.completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          onChange={event => event}
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
        data-cy="TodoDelete"
        onClick={() => handleRemoveTodo()}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn(
          'modal overlay',
          { 'is-active': loadingStatus },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
