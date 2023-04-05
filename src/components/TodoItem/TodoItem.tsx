import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { AppContext } from '../AppProvider';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const { removeTodoById, triggerRemoveCompleted } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(id === 0);

  const handleRemove = () => {
    setIsLoading(true);
    removeTodoById(id).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    if (triggerRemoveCompleted && completed) {
      handleRemove();
    }
  }, [triggerRemoveCompleted, completed]);

  return (
    <div className={classNames('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        onClick={handleRemove}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        className={classNames(
          'modal overlay',
          { 'is-active': isLoading },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
