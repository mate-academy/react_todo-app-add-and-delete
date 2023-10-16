import { useState } from 'react';

import cn from 'classnames';
import * as todosAPI from '../../api/todos';
import { Todo } from '../../types/Todo';
import { useTodosState } from '../../contexts/TodosContext';
import { useErrorsState } from '../../contexts/ErrorsContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    id,
    completed,
    title,
  } = todo;
  const [, todosDispatch] = useTodosState();
  const [, setErrorMessage] = useErrorsState();

  const [isEdited] = useState(false); // ToDo
  const [isDeleting, setIsDeleting] = useState(false);

  const isTempTodo = id === 0;

  const handleTodoCompletedChange = () => {
    todosDispatch({ type: 'toggle completed status', payload: id });
  };

  const handleTodoDeleting = () => {
    setIsDeleting(true);
    setErrorMessage('');

    todosAPI.deleteTodo(id)
      .then(() => todosDispatch({ type: 'delete', payload: id }))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setIsDeleting(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={completed}
          onClick={handleTodoCompletedChange}
        />
      </label>

      {
        isEdited ? (
          <form>
            <input
              data-cy="TodoTitleField"
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        ) : (
          <>
            <span data-cy="TodoTitle" className="todo__title">
              {title}
            </span>

            <button
              type="button"
              className="todo__remove"
              data-cy="TodoDelete"
              onClick={handleTodoDeleting}
            >
              ×
            </button>
          </>
        )
      }

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isTempTodo || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
