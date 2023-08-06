import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo,
  onDeleteTodo: (todoId: number) => void,
  deletingIds: number[],
};

export const TodoListItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  deletingIds,
}) => {
  return (
    <div className={cn('todo', {
      completed: todo.completed,
    })}
    >
      <label className="todo__status-label">
        <input
          checked={todo.completed}
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => onDeleteTodo(todo.id)}
      >
        x
      </button>

      <div
        className={
          cn('modal overlay', { 'is-active': deletingIds.includes(todo.id) })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
