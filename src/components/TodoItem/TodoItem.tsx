import classNames from 'classnames';
import { useState } from 'react';
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
  const [clicked, setClicked] = useState<boolean>(false);
  const { title, id } = todo;

  return (
    <div
      className={classNames('todo', {
        completed: clicked,
      })}
      data-cy="Todo"
      key={id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked
          data-cy="TodoStatus"
          onClick={() => setClicked(!clicked)}
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
      { selectedId.includes(id) && (
        <TodoLoader />
      )}

      { (isAdding && id === 0) && (
        <TodoLoader />
      )}

    </div>
  );
};
