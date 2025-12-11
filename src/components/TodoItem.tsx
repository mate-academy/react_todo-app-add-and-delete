/* eslint-disable jsx-a11y/label-has-associated-control */
import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  loadingTodoIds: number[];
  // isLoading?: boolean;
  onChange: (todo: Todo) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
};

export const TodoItem = ({
  todo,
  loadingTodoIds,
  // isLoading = false,
  onChange,
  onRemove,
}: Props) => {
  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
        active: !todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => onChange(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onRemove(todo.id)}
      >
        ×
      </button>

      {/* {loadingTodoIds.includes(todo.id) && (
      )} */}
      {/* <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div> */}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': loadingTodoIds.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
