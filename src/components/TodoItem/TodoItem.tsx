import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo,
  withLoader?: boolean,
  onRemoveTodo: (id: number) => void,
  onCompletedChange: (value: Todo) => void
};

export const TodoItem: React.FC<Props> = ({
  todo,
  withLoader,
  onRemoveTodo,
  onCompletedChange,

}) => {
  const { id, completed, title } = todo;

  const [hasLoader, setHasLoader] = useState(withLoader);

  const onHandleDeleteClick = () => {
    onRemoveTodo(id);
    setHasLoader(true);
  };

  const handleClick = () => {
    onCompletedChange(todo);
  };

  return (
    <div
      key={id}
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label
        className="todo__status-label"
      >

        <input
          type="checkbox"
          className="todo__status"
          onClick={handleClick}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={onHandleDeleteClick}
      >
        ×
      </button>

      {hasLoader && (
        <div className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
