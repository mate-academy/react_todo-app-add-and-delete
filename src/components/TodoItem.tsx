/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  onDeleteTodo: (todoId: Todo['id']) => void;
  isLoading: boolean;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  isLoading,
}) => {
  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
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

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDeleteTodo(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated  also add is-active*/}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
