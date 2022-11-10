import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  isDeleting?: boolean;
  deleteTodo?: (todoId: number) => void;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isAdding,
  deleteTodo,
  isDeleting,
}) => {
  const { completed, id, title } = todo;

  const handleDeleteTodoClick = () => {
    if (deleteTodo) {
      deleteTodo(id);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo',
        { completed })}
      key={id}
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
        onClick={handleDeleteTodoClick}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isAdding || isDeleting,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
