import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader/Loader';

type Props = {
  todo: Todo;
  isAdding?: boolean;
  selectedTodosIds: number[];
  onDelete: (id: number) => Promise<void>,
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isAdding,
  selectedTodosIds,
  onDelete,
}) => {
  const { id, title, completed } = todo;
  const loaderCondition = selectedTodosIds.includes(todo.id)
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
        onClick={() => onDelete(id)}
      >
        ×
      </button>
      { loaderCondition && (
        <Loader
          isActive={isAdding}
        />
      )}
    </div>
  );
};
