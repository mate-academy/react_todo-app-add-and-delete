import cn from 'classnames';
import { Todo as TodoType } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: TodoType;
  deleteAll: boolean;
  deleteTodo: (id: number) => Promise<void>;
};

export const Todo: React.FC<Props> = ({ todo, deleteAll, deleteTodo }) => {
  const { id, title, completed } = todo;

  const [isLoading, setIsLoading] = useState(false);

  const deleteItem = async () => {
    setIsLoading(true);

    try {
      await deleteTodo(id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div data-cy="Todo" className={cn('todo', { completed })}>
        <label className="todo__status-label">
          <input
            aria-label={`Mark ${title} as ${completed ? 'incomplete' : 'complete'}`}
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={deleteItem}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being deleted or updated */}
        <div
          data-cy="TodoLoader"
          className={cn('modal', 'overlay', {
            'is-active': isLoading || (deleteAll && completed),
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
      {
        // #region Todos in different states
      }
      {/* This todo is an active todo
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          Not Completed Todo
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is being edited
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        This form is shown instead of the title and remove button
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
        <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}

      {/* This todo is in loadind state
      <div data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>
        <span data-cy="TodoTitle" className="todo__title">
          Todo is being saved now
        </span>
        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>
        'is-active' class puts this modal on top of the todo
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div> */}
      {
        // #endregion
      }
    </>
  );
};
