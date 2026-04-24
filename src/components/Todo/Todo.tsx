import classNames from 'classnames';
import { Todo as TodoType } from '../../types/Todo';

type Props = {
  todo: TodoType;
  isSelected: boolean;
  isLoading: boolean;
  onDeleteTodo: (id: number) => void;
  onToggleCompleted: (id: number) => void;
};

export const Todo: React.FC<Props> = ({
  todo,
  isSelected,
  isLoading,
  onDeleteTodo,
  onToggleCompleted,
}) => {
  const { id, completed, title } = todo;

  function handleToggleCompleted() {
    onToggleCompleted(id);
  }

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: completed,
      })}
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handleToggleCompleted}
        />
      </label>

      {isSelected ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">
            {title}
          </span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDeleteTodo(id)}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
