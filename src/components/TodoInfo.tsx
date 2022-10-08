import classNames from 'classnames';
import { Todo } from '../types/Todo';

interface Props {
  todo: Todo,
  removeTodo: (TodoId: number) => Promise<void>,
  selectedId: number[],
  isAdding: boolean,
}

export const TodoInfo: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedId,
  isAdding,
}) => {
  const { id, title, completed } = todo;

  const loader = selectedId.includes(todo.id)
  || (isAdding && todo.id === 0);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed })}
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

      <span data-cy="TodoTitle" className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => {
          removeTodo(todo.id);
        }}
      >
        ×
      </button>

      { loader && (
        <div
          data-cy="TodoLoader"
          className="modal overlay is-active"
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader is-loading " />
        </div>
      )}
    </div>
  );
};
