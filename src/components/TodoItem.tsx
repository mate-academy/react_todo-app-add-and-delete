import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo;
  handleToggleTodo: (todoId: number) => void;
  handleDeleteTodo: (id: number) => void;
  isProcessing: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleToggleTodo,
  handleDeleteTodo,
  isProcessing,
}) => {
  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label" htmlFor={`todo-status-${todo.id}`}>
        <input
          data-cy="TodoStatus"
          id={`todo-status-${todo.id}`}
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleToggleTodo(todo.id)}
          disabled={isProcessing}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteTodo(todo.id)}
        disabled={isProcessing}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isProcessing,
        })}
      >
        {/* eslint-disable-next-line max-len*/}
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
