/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  isNewTodoAdding?: boolean;
  loadingTodo?: Todo;
  todoIdsForRemoving: number[] | null;
  isTodoDeleting?: boolean;
  setTodoIdsForRemoving?: (id: number[] | null) => void;
  setIsTodoDeleting?: (isTodoDeleting: boolean) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isNewTodoAdding,
  todoIdsForRemoving,
  isTodoDeleting,
  setTodoIdsForRemoving,
  setIsTodoDeleting,
}) => {
  const { completed, title, id } = todo;

  const onDelete = () => {
    if (setTodoIdsForRemoving && setIsTodoDeleting) {
      setTodoIdsForRemoving(
        todoIdsForRemoving ? [...todoIdsForRemoving!, id] : [id],
      );
      setIsTodoDeleting(true);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
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
        onClick={onDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isNewTodoAdding ||
            (isTodoDeleting && todoIdsForRemoving?.includes(id)),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
