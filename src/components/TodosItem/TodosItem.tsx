import cn from 'classnames';
import { useContext, useState } from 'react';
import { TodosContext } from '../../TodosContext';
import { Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
};

export const TodosItem: React.FC<Props> = ({ todo }) => {
  const { id, title, completed } = todo;
  const { deleteTodo, deletingTodosId } = useContext(TodosContext);

  const [isUpdating, setIsUpdating] = useState(false);

  const isTodosDeleting = deletingTodosId.some(delId => delId === id);

  const handleDeleteButtonClick = () => {
    setIsUpdating(true);

    deleteTodo(id)
      .finally(() => setIsUpdating(false));
  };

  return (
    <li className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleDeleteButtonClick}
      >
        ×

      </button>

      <div
        className={cn('modal overlay',
          { 'is-active': isUpdating || isTodosDeleting })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
