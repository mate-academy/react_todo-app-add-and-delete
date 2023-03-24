import { FC, useContext, useState } from 'react';
import classNames from 'classnames';
import type { Todo as TodoType } from '../../types/Todo';
import { LoadingTodoContext } from '../../LoadingTodoContext';

type Props = {
  onDelete: (id: number) => void;
  todo: TodoType;
};

export const TodoItem: FC<Props> = ({
  todo,
  onDelete,
}) => {
  const { id, title, completed } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);
  const { isLoading, todoId } = useContext(LoadingTodoContext);

  const handleStatusChange = () => {
    setIsCompleted((prev) => !prev);
  };

  return (
    <div
      className={classNames('todo', {
        completed: isCompleted,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleStatusChange}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        className={classNames('modal overlay', {
          'is-active': isLoading && todoId === id,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
