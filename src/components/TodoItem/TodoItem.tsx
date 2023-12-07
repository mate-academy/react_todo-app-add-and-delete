import cn from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDelete: (v: number) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, onDelete }) => {
  const { id, completed, title } = todo;
  const [isCompleted, setIsCompleted] = useState(completed);

  const inputChangeHandler = () => {
    setIsCompleted((completedTodo) => !completedTodo);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: isCompleted,
      })}
    >
      <label
        className="todo__status-label"
      >
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          name="inputTodo"
          onChange={inputChangeHandler}
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
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
