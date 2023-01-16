import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader';

type Props = {
  todo: Todo,
  isAdding?: boolean,
  isDeleting?: boolean,
  onDelete: (todoId: number) => void,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  isDeleting,
  onDelete,
}) => {
  const { title, completed } = todo;

  return (
    <div
      data-cy="Todo"
      className={cn(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <TodoLoader
        isActive={isAdding}
        isDeleting={isDeleting}
      />
    </div>
  );
};
