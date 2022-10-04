import classNames from 'classnames';
import { Todo } from '../../../types/Todo';

type Props = {
  todo: Todo;
  removeTodo: (TodoId: number) => Promise<void>;
  selectedIds: number[];
  isAdding: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedIds,
  isAdding,
}) => {
  const loaderCondition = selectedIds.includes(todo.id)
    || (isAdding && todo.id === 0);

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo',
        {
          completed: todo.completed,
        },
      )}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
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
      { loaderCondition && (
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
