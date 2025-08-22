/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  handleActive: (value: number) => void;
  todo: Todo;
  deleteTodo: (id: number) => Promise<void>;
  isDeleting: boolean;
  isDeletingSeveral: boolean;
  isSubmitting?: boolean;
};

export const ToDo: React.FC<Props> = ({
  handleActive,
  todo,
  deleteTodo,
  isDeleting,
  isDeletingSeveral,
  isSubmitting,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label" htmlFor={`${todo.id}`}>
        <input
          data-cy="TodoStatus"
          type="checkbox"
          id={`${todo.id}`}
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleActive(todo.id)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isDeleting || isDeletingSeveral || isSubmitting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
