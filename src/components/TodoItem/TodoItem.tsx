/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { useContext, useState } from 'react';
import { DispatchContext } from '../../store/Store';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const dispatch = useContext(DispatchContext);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const handleDeleteTodo = () => {
    setIsDeleting(true);
    deleteTodo(todo.id)
      .then(() => {
        dispatch({ type: 'DELETE_TODO', payload: { id: todo.id } });
      })
      .catch(() => {
        dispatch({
          type: 'SHOW_ERROR_MESSAGE',
          payload: { message: 'Unable to delete a todo' },
        });
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': isDeleting || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
