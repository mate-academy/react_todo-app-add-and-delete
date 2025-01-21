import classNames from 'classnames';
import { Todo } from '../../types/Todo';

interface TodoItemProps {
  todo: Todo;
  isActiveModal: boolean;
  handleDeleteTodo: (todoId: number) => Promise<void>;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo: { id, title, completed },
  isActiveModal,
  handleDeleteTodo,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label" htmlFor={`TodoStatus-${id}`}>
        <input
          aria-labelledby={`TodoStatus-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={() => {
            // handleUpdateTodo({
            //   ...todo,
            //   completed: !todo.completed,
            // });
          }}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': isActiveModal,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
