/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoType } from '../types/Todo';
import { useState } from 'react';

type Props = {
  todo: TodoType;
  isTemp?: boolean;
  deleteTodo: (todoId: number) => Promise<boolean>;
};

export default function Todo({ todo, isTemp, deleteTodo }: Props) {
  const [isEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function handleButton() {
    setIsDeleting(true);

    deleteTodo(todo.id).catch(() => {
      setIsDeleting(false);
    });
  }

  return (
    <div
      data-cy="Todo"
      className={'todo' + (todo.completed ? ' completed' : '')}
    >
      {isEditing ? (
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
          <label className="todo__status-label" htmlFor="input">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              readOnly
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
            onClick={handleButton}
          >
            ×
          </button>

          <div
            data-cy="TodoLoader"
            className={
              'modal overlay' + (isTemp || isDeleting ? ' is-active' : '')
            }
          >
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </>
      )}
    </div>
  );
}
