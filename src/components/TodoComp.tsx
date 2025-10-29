import cn from 'classnames';
import { Todo } from '../types/Todo';

type Props = {
  todo: Todo;
  isEditing?: boolean;
  isLoading?: boolean;
  onDeleteTodo: (id: number) => void;
};

export const TodoComp: React.FC<Props> = ({
  todo,
  isEditing = false,
  isLoading = false,
  onDeleteTodo,
}) => {
  const isCompleted = todo?.completed ?? false;

  return (
    <div data-cy="Todo" className={cn('todo', { completed: isCompleted })}>
      <label
        htmlFor={`todo-${todo.id}`}
        className="todo__status-label"
        aria-label="Toggle todo status"
      >
        <input
          id={`todo-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          readOnly
        />
      </label>
      {!isEditing && (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {todo.title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(todo.id)}
          >
            ×
          </button>
        </>
      )}
      {isEditing && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todo.title}
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
