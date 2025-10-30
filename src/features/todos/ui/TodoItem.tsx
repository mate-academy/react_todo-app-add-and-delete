import { useContext, useState } from 'react';
import classNames from 'classnames';
import { useNotification } from '../contexts/NotificationContext';
import { TodosContext } from '../contexts/TodoContext';
import { EditContext } from '../contexts/EditContext';
import { TodoEdit } from '../ui/TodoEdit';
import { ACTIONS } from '../model/actions';
import { ErrorType, Todo } from '../model/types';
import { useFocus } from '../contexts/FocusContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const { completed, title, id } = todo;
  const { showNotification, hideNotification } = useNotification();
  const { dispatch, handleDeleteTodo, deletingTodoIds } =
    useContext(TodosContext);
  const { editedTodoId, setEditedTodoId } = useContext(EditContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const { focusInput } = useFocus();

  const isBeingDeleted = deletingTodoIds?.includes(id);

  const handleToggle = () => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id, completed } });
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const ok = await handleDeleteTodo(id);

    if (!ok) {
      showNotification(ErrorType.DELETE_TODO);
    } else {
      hideNotification();
      focusInput();
    }

    setIsDeleting(false);
  };

  const completedTodoClass = classNames('todo', { completed: completed });

  const modalLoaderClass = () => {
    return classNames('modal overlay', {
      'is-active':
        editedTodoId === id || isLoading || isDeleting || isBeingDeleted,
    });
  };

  return (
    <div data-cy="Todo" className={completedTodoClass}>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label" htmlFor={`completed-${id}`}>
        <input
          id={`completed-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleToggle}
        />
      </label>

      {editedTodoId === id ? (
        <TodoEdit title={title} id={id} />
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setEditedTodoId(id)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      )}
      <div data-cy="TodoLoader" className={modalLoaderClass()}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
