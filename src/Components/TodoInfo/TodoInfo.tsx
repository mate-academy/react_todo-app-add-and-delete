import { FC } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  isAdd?: boolean,
  deleteTodosId?: number[] | null,
  onDelete?: (idTodo: number) => void,
};

const TodoInfo: FC<Props> = ({
  todo,
  isAdd,
  deleteTodosId,
  onDelete,
}) => {
  const hendlerRemoveItem = () => {
    if (onDelete) {
      onDelete(todo.id);
    }
  };

  return (
    <>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{todo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={hendlerRemoveItem}
      >
        ×
      </button>

      {/* <form>
        <input
          type="text"
          className="todo__title-field"
          placeholder="Empty todo will be deleted"
          value="Todo is being edited now"
        />
      </form> */}

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isAdd || deleteTodosId?.includes(todo.id) },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </>
  );
};

export default TodoInfo;
