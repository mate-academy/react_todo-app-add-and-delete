import { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  tempTodo?: Todo | null;
  deleteTodo?: (todoId: number) => void;
  isAdding?: boolean,
};

export const TodoItem: React.FC<Props> = ({ todo, deleteTodo, isAdding }) => {
  const { title, id, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteTodo = () => {
    if (!deleteTodo) {
      return;
    }

    setIsDeleting(true);
    deleteTodo(id);
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
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo()}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
