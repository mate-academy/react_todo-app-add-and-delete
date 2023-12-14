import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from './loader';

type Props = {
  todo: Todo;
  onDelete: (postId: number) => void;
  deletedPostsIds: number[];
};

export const Todos: React.FC<Props> = ({
  todo,
  onDelete,
  deletedPostsIds,
}) => {
  return (
    <div
      data-cy="Todo"
      className={cn({
        completed: todo.completed,
      }, 'todo')}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
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
      {deletedPostsIds.includes(todo.id) && (
        <Loader />
      )}
    </div>
  );
};
