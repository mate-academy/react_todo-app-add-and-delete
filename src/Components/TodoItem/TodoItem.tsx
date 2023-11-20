import './style.scss';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  edited: Todo | null,
  updateProcessing: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  edited,
  updateProcessing,
}) => {
  const isCurrentEdited = edited?.id === todo.id;

  return (
    <div
      data-cy="Todo"
      className={cn({
        todo: true,
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isCurrentEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {todo.title}
            </span>

            <button type="button" className="todo__remove" data-cy="TodoDelete">
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={cn({
          modal: true,
          overlay: true,
          updateProcessing: isCurrentEdited && updateProcessing,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
