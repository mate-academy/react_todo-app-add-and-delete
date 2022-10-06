import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  isLoading: boolean;
  removeTodo: (TodoId: number) => void;
  isSelectId: number[];
};

export const TodoItem: React.FC<Props> = ({
  todo,
  isLoading,
  removeTodo,
  isSelectId,
}) => {
  const { title, id, completed } = todo;

  return (
    <div
      data-cy="Todo"
      key={id}
      className={classNames('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
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
        onClick={() => removeTodo(id)}
      >
        ×
      </button>
      {isSelectId.includes(id) && (
        <TodoLoader />
      )}

      {(isLoading && id === 0) && (
        <TodoLoader />
      )}
    </div>
  );
};
