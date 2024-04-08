import classNames from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  TodoDeleteButton: (todoId: number) => void;
  todo: Todo;
  isLoading: number[];
};

export const TodoItem: React.FC<Props> = ({
  TodoDeleteButton,
  todo,
  isLoading,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label
        aria-label="Todo status"
        className="todo__status-label"
        htmlFor="todo"
      >
        <input
          id="todo"
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => TodoDeleteButton(todo.id)}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isLoading.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
