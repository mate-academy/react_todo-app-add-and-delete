/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  isTemp?: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
  inputRef: React.RefObject<HTMLInputElement>;
  todosToDelete: number[];
  setTodosToDelete: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoInfo: React.FC<Props> = ({
  todo,
  isTemp = false,
  setTodos,
  setErrorMessage,
  inputRef,
  todosToDelete,
  setTodosToDelete,
}) => {
  const { title, id, completed } = todo;
  const [isEditing, setIsEditing] = useState(false);
  const [changedTitle, setChangedTitle] = useState(title);
  const [loader, setLoader] = useState(false);

  const handleChangeOfTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChangedTitle(event.target.value);
  };

  const handleDelete = () => {
    setLoader(true);

    deleteTodo(todo.id)
      .then(() => {
        setTodos(prev => prev.filter(item => item.id !== todo.id));
        if (inputRef.current) {
          inputRef.current.focus();
        }
      })
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const handleChangeSubmit = () => {};

  const eventListenerKeyboard = () => {};

  const switchCompleted = () => {};

  useEffect(() => {
    todosToDelete.forEach((idToDelete, index) => {
      if (todo.id === idToDelete) {
        handleDelete();
        setTodosToDelete(prev => prev.filter((_, i) => i !== index));
      }
    });
  }, [todosToDelete, todo.id, setTodosToDelete]);

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label htmlFor={`checked-${id}`} className="todo__status-label">
        <input
          id={`checked-${id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={switchCompleted}
        />
      </label>

      {!isEditing ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onClick={() => setIsEditing(true)}
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
      ) : (
        <form onSubmit={handleChangeSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            autoFocus
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={changedTitle}
            onChange={handleChangeOfTitle}
            onBlur={() => {
              handleChangeSubmit();
              setIsEditing(false);
            }}
            onKeyUp={() =>
              document.addEventListener('keyup', eventListenerKeyboard)
            }
          />
        </form>
      )}

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': !todo || isTemp || loader,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
