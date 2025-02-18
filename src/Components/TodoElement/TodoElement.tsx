import classNames from 'classnames';
import { TodosContext } from '../../Context/TodoContext';
import { useContext, useState } from 'react';
import { TodoEdit } from '../TodoEdit';
import { EditContext } from '../../Context/EditContext';
import { ACTIONS } from '../../types/Actions';
import { Todo } from '../../types/Todo';
import { useNotification } from '../../Context/NotificationContext';

type Props = {
  todo: Todo;
  isLoading?: boolean;
};

export const TodoElement: React.FC<Props> = ({ todo, isLoading }) => {
  const { completed, title, id } = todo;
  const { showNotification, hideNotification } = useNotification();
  const { dispatch, handleDeleteTodo, deletingTodoIds } =
    useContext(TodosContext);
  const { editedTodoId, setEditedTodoId } = useContext(EditContext);
  const [isDeleting, setIsDeleting] = useState(false);

  const isBeingDeleted = deletingTodoIds?.includes(id);

  const handleToggle = () => {
    dispatch({ type: ACTIONS.TOGGLE_TODO, payload: { id, completed } });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteTodo(id);
      hideNotification();
    } catch (error) {
      showNotification('Unable to delete a todo');
    } finally {
      setIsDeleting(false);
    }
  };

  const completedTodoClass = classNames('todo', {
    completed: completed,
  });

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
