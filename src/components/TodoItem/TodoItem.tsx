/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../helpers';
import { AppContext } from '../../wrappers/AppProvider';

export interface ITodoItem {
  todo: Todo;
}

export const TodoItem: FC<ITodoItem> = ({ todo }) => {
  const { setErrorType, setTodos, todoDeleteId, inputRef } =
    useContext(AppContext);

  const [isDeleting, setIsDeleting] = useState(false);

  const { title, completed } = todo;

  const deletingThisTodo = todoDeleteId?.includes(todo.id);

  const onDeleteClick = async () => {
    try {
      setIsDeleting(true);

      await deleteTodos(todo.id);

      setTodos(prevState => prevState.filter(el => el.id !== todo.id));
      inputRef.current?.focus();
    } catch (err) {
      setErrorType('delete');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div data-cy="Todo" className={`todo ${completed ? 'completed' : ''}`}>
      <label className="todo__status-label">
        <input
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
        onClick={onDeleteClick}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={`modal overlay ${isDeleting || deletingThisTodo ? 'is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
