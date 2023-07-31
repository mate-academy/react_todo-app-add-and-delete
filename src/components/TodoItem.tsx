import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { wait } from '../utils/fetchClient';

type Props = {
  todo: Todo,
  onDelete: (todoId: number) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);

    wait(3000)
      .then(() => onDelete(todo.id))
      .finally(() => setIsLoading(false));
  };

  return (

    <div className={classNames('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDelete}
      >
        ×
      </button>

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
