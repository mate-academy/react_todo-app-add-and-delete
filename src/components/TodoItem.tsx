import { Todo } from '../types/Todo';
import cn from 'classnames';

interface Props {
  todo: Todo;
  tempTodo?: Todo;
  handleDeleteTodo?: (todoId: number) => void;
  todosBeingDeleted?: number[];
}

export const TodoItem: React.FC<Props> = ({
  todo,
  handleDeleteTodo = () => {},
  tempTodo,
  todosBeingDeleted,
}: Props) => {
  const { id, title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      // eslint-disable-next-line prettier/prettier
      className={cn('todo', { 'completed': completed })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
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
        className={cn('modal overlay', {
          'is-active': tempTodo || todosBeingDeleted?.includes(id),
        })}
      >
        {(tempTodo || todosBeingDeleted?.includes(id)) && (
          <div className="modal-background has-background-white-ter" />
        )}
        <div className="loader" />
      </div>
    </div>
  );
};
