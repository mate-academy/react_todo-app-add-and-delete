import { FC, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todos';

type Props = {
  todo: Todo,
  onDelete: (id: number) => void,
  loadingTodosId: number[],
};

export const TodoItem: FC<Props> = (props) => {
  const {
    todo,
    onDelete,
    loadingTodosId,
  } = props;

  const {
    id,
    title,
    completed,
  } = todo;

  const isTodoIdLoading = loadingTodosId.includes(id);

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleTodoCheck = () => {
    setIsCompleted(prevState => !prevState);
  };

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed: isCompleted },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={isCompleted}
          onChange={handleTodoCheck}
        />
      </label>

      <span className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        onClick={() => onDelete(id)}
      >
        ×
      </button>

      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isTodoIdLoading },
        )}
      >

        <div className="modal-background has-background-white-ter" />

        <div className="loader" />
      </div>
    </div>
  );
};
