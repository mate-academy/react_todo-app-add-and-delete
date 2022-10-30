import classnames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todo: Todo;
  onDelete: (id: number[]) => void;
  onStatusChange: (todoId: number, data: Partial<Todo>) => void;
  loadingTodoIds: number[],
  isAdding: boolean,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onDelete,
  onStatusChange,
  loadingTodoIds,
  isAdding,
}) => {
  const { id, title, completed } = todo;
  const loaderCondition = loadingTodoIds.includes(todo.id)
  || (isAdding && todo.id === 0);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classnames(
        'todo',
        { completed: todo.completed },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            onStatusChange(id, { completed: !completed });
          }}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
      >
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => onDelete([id])}
      >
        &times;
      </button>

      {loaderCondition && (
        <Loader
          isAdding={isAdding}
        />
      )}
    </div>
  );
};
