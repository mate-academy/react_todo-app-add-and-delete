import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoLoader } from '../TodoLoader/TodoLoader';

type Props = {
  todo: Todo;
  removeTodo: (TodoId: number) => void;
  selectedId: number[];
  isAdded: boolean;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  removeTodo,
  selectedId,
  isAdded,
}) => {
  const [clicked, setClicked] = useState<boolean>(false);

  return (
    <div
      className={classNames('todo', {
        completed: clicked,
      })}
      data-cy="Todo"
      key={todo.id}
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
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => removeTodo(todo.id)}
      >
        x
      </button>
      { selectedId.includes(todo.id) && (
        <TodoLoader />
      )}

      { (isAdded && todo.id === 0) && (
        <TodoLoader />
      )}

    </div>
  );
};
