import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { useAppContext } from '../AppProvider';

interface Props {
  todo: Todo;
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    title,
    completed,
  } = todo;

  const {
    removeTodoById,
    arrayOfTodosToRemove,
    setArrayOfTodosToRemove,
  } = useAppContext();

  const [isLoading, setIsLoading] = useState(id === 0);

  const handleRemove = () => {
    setArrayOfTodosToRemove((prev: Todo[]) => [
      ...prev,
      todo,
    ]);
    setIsLoading(true);
    removeTodoById(id).finally(() => {
      setIsLoading(false);
    });
  };

  useEffect(() => {
    const isTodoBeeingRemoved = arrayOfTodosToRemove.some(
      todoToRemove => todoToRemove.id === id,
    );

    setIsLoading(isTodoBeeingRemoved);
  }, [arrayOfTodosToRemove]);

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
