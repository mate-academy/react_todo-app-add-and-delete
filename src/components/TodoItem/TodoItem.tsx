import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todo: Todo,
  isTempTodo?: boolean,
}

export const TodoItem: React.FC<Props> = ({
  todo: {
    id,
    title,
    completed,
  },
  isTempTodo = false,
}) => {
  const { deleteTodo } = useContext(TodosContext);
  const [isDeliting, setIsDeliting] = useState(false);
  const [isEditing] = useState(false);

  const handleDeleteButton = () => {
    setIsDeliting(true);

    if (deleteTodo) {
      deleteTodo(id)
        .finally(() => {
          setIsDeliting(false);
        });
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${completed && 'completed'}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEditing
        ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>
            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleDeleteButton}
            >
              ×
            </button>
          </>
        )}

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal',
          'overlay',
          { 'is-active': isTempTodo || isDeliting },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
