import { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo?: Todo,
  removeTodo?: (todoId: number) => void,
  removingId?: number | null,
};

export const TodoItem:React.FC<Props> = ({ todo, removeTodo, removingId }) => {
  const [isHover, setIsHover] = useState<boolean>(false);

  return (
    <div
      key={todo?.id}
      className={classNames('todo', {
        completed: todo?.completed,
      })}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo?.completed}
          onChange={() => {}}
        />
      </label>

      <span className="todo__title">{todo?.title}</span>
      {isHover && (
        <button
          type="button"
          className="todo__remove"
          onClick={() => removeTodo?.(todo!.id)}
        >
          ×
        </button>
      )}

      {/* This form is shown instead of the title and remove button */}
      {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

      <div className={classNames('modal overlay', {
        // 'is-active': !removeTodo,
        'is-active': removingId === todo?.id,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
