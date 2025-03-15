/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  setTodos: (todos: Todo[]) => void;
  todos: Todo[];
  handleDeletion: (todoId: number) => void;
  isLoading: boolean;
};

export const SingleTodo: React.FC<Props> = ({
  todo,
  handleDeletion,
  isLoading,
}) => {
  const todoClassName = classNames('todo', { completed: todo.completed });
  const modalClassName = classNames('modal', 'overlay', {
    'is-active': isLoading,
  });

  return (
    <div data-cy="Todo" className={todoClassName}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        onClick={() => handleDeletion(todo.id)}
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div data-cy="TodoLoader" className={modalClassName}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
