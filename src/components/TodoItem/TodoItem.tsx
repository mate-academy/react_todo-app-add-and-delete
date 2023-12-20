import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo
  onTitle: (title: string) => void
  onDelete: (todoId: number) => void
  loadingTodos: number[]
}

export const TodoItem: React.FC<Props> = ({
  todo,
  onTitle,
  onDelete,
  loadingTodos,
}) => (
  <div
    data-cy="Todo"
    className={cn('todo', {
      completed: todo.completed,
    })}
    key={todo.id}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        value={todo.title}
        onChange={(event) => onTitle(event.target.value)}
        checked
      />
    </label>
    <span data-cy="TodoTitle" className="todo__title">
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
      className={cn('modal overlay', {
        'is-active': loadingTodos.includes(todo.id),
      })}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
