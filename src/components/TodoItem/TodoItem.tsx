import classNames from 'classnames';
import { useMemo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdding: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedId,
  isAdding,
}) => {
  const { title, id, completed } = todo;

  const isLoader = useMemo(() => isAdding
  && selectedId.includes(id), [isAdding, selectedId, id]);

  return (
    <div
      className={classNames('todo', {
        completed,
      })}
      data-cy="Todo"
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          data-cy="TodoStatus"
        />
      </label>

      <span
        className="todo__title"
        data-cy="TodoTitle"
      >
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(id)}
      >
        x
      </button>
      { (isLoader) && (
        <TodoLoader />
      )}

    </div>
  );
};
