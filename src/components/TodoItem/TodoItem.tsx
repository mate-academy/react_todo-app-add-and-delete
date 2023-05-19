import { memo, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  tempTodoId?: number;
  onDelete: (todoToDelete: Todo) => void;
};

export const TodoItem: React.FC<Props> = memo(({
  todo,
  tempTodoId = 0,
  onDelete = () => {},
}) => {
  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);
  const { title, completed } = todo;

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => {
          setIsLoading(true);

          onDelete(todo);

          setIsLoading(false);
        }}
        disabled={todo.id === tempTodoId}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
