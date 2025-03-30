import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  isLoading: boolean | undefined;
}

export const TodoItem = ({
  todo,
  toggleTodo,
  deleteTodo,
  isLoading,
}: Props) => (
  <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
      />
      <span className="visually-hidden">Mark as done</span>
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    <button
      type="button"
      className="todo__remove"
      data-cy="TodoDelete"
      onClick={() => deleteTodo(todo.id)}
      disabled={isLoading}
    >
      ×
    </button>

    <div
      data-cy="TodoLoader"
      className={cn('modal overlay', { 'is-active': isLoading })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
