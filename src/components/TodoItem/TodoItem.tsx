import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  onDeleteIds?: number[] | null,
  handleClickRemove?: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteIds = [todo.id],
  handleClickRemove = () => {},
}) => {
  return (
    <div
      className={cn('todo', {
        completed: todo.completed,
      })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleClickRemove(todo.id)}
      >
        ×
      </button>

      <div
        className={cn('modal overlay', {
          'is-active': onDeleteIds?.includes(todo.id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
