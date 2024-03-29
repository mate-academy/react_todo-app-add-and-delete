/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  todoLoading?: boolean;
  onSelect?: (todo: Todo) => void;
  selected?: Todo | null;
  onDelete?: (todoId: number) => void;
  todoIsSubmiting?: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  todoLoading,
  onSelect = () => {},
  // selected,
  onDelete = () => {},
  todoIsSubmiting,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo ', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        onClick={() => onSelect(todo)}
      >
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay ', {
          'is-active': todoLoading || todoIsSubmiting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
