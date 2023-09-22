import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (
    todoId: number,
  ) => Promise<void>,
  areAllCompletedDeleting: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  areAllCompletedDeleting,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteTodo = () => {
    setIsDeleting(true);

    onDelete(todo.id)
      .finally(() => setIsDeleting(false));
  };

  return (
    <div
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      {/* 'is-active' class puts this modal on top of the todo */}
      {(isDeleting || (areAllCompletedDeleting && todo.completed)) && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}

      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          readOnly
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={deleteTodo}
      >
        ×
      </button>
    </div>
  );
};
