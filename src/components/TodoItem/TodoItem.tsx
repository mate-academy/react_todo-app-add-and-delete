/* eslint-disable jsx-a11y/label-has-associated-control */
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  selectedTodoId: number | undefined;
  isProcessed: boolean;
  onDelete?: (todoId: number) => void | undefined;
};

export const TodoItem = ({
  todo,
  selectedTodoId,
  isProcessed,
  onDelete,
}: Props) => (
  <div
    data-cy="Todo"
    className={cn('todo', {
      completed: todo.completed,
      selected: selectedTodoId === todo.id,
    })}
  >
    <label className="todo__status-label">
      <input
        data-cy="TodoStatus"
        type="checkbox"
        className="todo__status"
        checked={todo.completed}
        readOnly
      />
    </label>

    <span data-cy="TodoTitle" className="todo__title">
      {todo.title}
    </span>

    {/* Remove button appears only on hover */}
    <button
      data-cy="TodoDelete"
      type="button"
      className="todo__remove"
      onClick={() => onDelete?.(todo.id)}
    >
      ×
    </button>

    {/* overlay will cover the todo while it is being deleted or updated */}
    <TodoLoader isActive={isProcessed} />
  </div>
);
