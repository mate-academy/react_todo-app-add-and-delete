/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { Loader } from './Loader';

type TodoItemProps = {
  todo: Todo;
  handleToggle: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  isLoading: boolean;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  handleToggle,
  handleDeleteTodo,
  isLoading,
}) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames('todo', {
        completed: todo.completed,
        'is-active': isLoading,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            handleToggle(id, completed);
          }}
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
        onClick={() => {
          handleDeleteTodo(id);
        }}
        disabled={isLoading}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <Loader isLoading={isLoading} />
    </div>
  );
};
