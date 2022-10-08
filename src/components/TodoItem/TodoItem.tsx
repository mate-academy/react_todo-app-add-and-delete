import classNames from 'classnames';
import { useMemo } from 'react';
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

  const isLoader = useMemo(() => isSelectId.includes(id)
  || (isLoading && id === 0), [isLoading, isSelectId, id]);

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
          defaultChecked={completed}
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
      { (isLoader) && (
        <TodoLoader />
      )}
    </div>
  );
};
