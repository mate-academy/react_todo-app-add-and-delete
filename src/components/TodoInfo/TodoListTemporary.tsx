/* eslint-disable @typescript-eslint/no-non-null-assertion */
import classNames from 'classnames';
import { useAppContextContainer } from '../../context/AppContext';

/* eslint-disable jsx-a11y/label-has-associated-control */
const TodoListTemporary = () => {
  const { tempTodo, dltTodo } = useAppContextContainer();
  const { completed, id, title } = tempTodo!;

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
      key={id}
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
        onClick={() => dltTodo(id)}
      >
        ×
      </button>
      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoListTemporary;
