import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  tempTodo?: Todo | null;
  onDeleteTodo?: (todoId: number) => void;
  isAdding?: boolean,
  processingTodoIds: number[],
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDeleteTodo,
  processingTodoIds,
  isAdding,
}) => {
  const { title, id, completed } = todo;

  const handleDelete = () => {
    if (!onDeleteTodo) {
      return;
    }

    onDeleteTodo(id);
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
      key={id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete()}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': processingTodoIds.includes(id) || isAdding,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
