import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type PropTypes = {
  todo: Todo;
  handleDeleteTodo: (todoDel: Todo) => void;
  deletingId: number[];
};

export const TodoItem: React.FC<PropTypes> = ({
  todo,
  handleDeleteTodo,
  deletingId,
}) => {
  const [isEditing] = useState(false);
  const { completed, title } = todo;

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          checked={completed}
          className="todo__status"
          onChange={() => { }}
        />
      </label>

      {!isEditing
        ? (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDeleteButton"
              onClick={() => handleDeleteTodo(todo)}
            >
              ×
            </button>
          </>

        )
        : (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              defaultValue={title}
            />
          </form>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': todo.id === 0
            || deletingId.includes(todo.id),
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
