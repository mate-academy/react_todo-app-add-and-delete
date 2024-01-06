/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todoItem: Todo,
  onDelete?: (id: number) => void;
  loader: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todoItem,
  onDelete = () => { },
  loader,
}) => {
  const [hover, setHover] = useState(false);

  const [editing] = useState(false);
  const { title, completed } = todoItem;

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed,
        },
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          readOnly
        />
      </label>

      {
        editing
          ? (
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
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
          )
      }

      {
        !editing && hover && (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={() => onDelete(todoItem.id)}
          >
            ×
          </button>
        )
      }

      {
        loader && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )
      }
    </div>
  );
};
