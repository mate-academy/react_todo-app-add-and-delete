import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  onDelete: (todoToDelete: Todo) => void;
  isEditingTodoId: number;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  onDelete,
  isEditingTodoId,
}) => (
  <div
    className={cn(
      'todo',
      { completed: todo.completed },
    )}
  >
    <label className="todo__status-label">
      <input
        type="checkbox"
        className="todo__status"
        checked
      />
    </label>

    <span className="todo__title">{todo.title}</span>

    <button
      type="button"
      className="todo__remove"
      onClick={() => onDelete(todo)}
    >
      ×
    </button>

    <div className={cn(
      'modal overlay',
      { 'is-active': isEditingTodoId === todo.id },
    )}
    >
      <div className="modal-background has-background-white-ter" />
      <div className="loader" />
    </div>
  </div>
);
