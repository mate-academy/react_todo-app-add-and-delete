/* eslint-disable jsx-a11y/label-has-associated-control */

import { Todo } from '../types/Todo';
import classNames from 'classnames';
import { changeTodo, deleteTodo } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

type Props = {
  todo: Todo;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (e: ErrorMessage) => void;
  loadingIds: number[];
  setLoadingIds: (ids: number[]) => void;
  focusInput: () => void;
};

export const TodoItem = ({
  todo: { title, id, completed },
  setTodos,
  setErrorMessage,
  loadingIds,
  setLoadingIds,
  focusInput,
}: Props) => {
  const handleCheckbox = () => {
    setLoadingIds([...loadingIds, id]);
    changeTodo(id, { completed: !completed })
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.map(prevTodo => {
            if (prevTodo.id !== id) {
              return prevTodo;
            }

            return {
              ...prevTodo,
              completed: !completed,
            };
          }),
        ),
      )
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => setLoadingIds(loadingIds.filter(loadId => loadId !== id)));
  };

  const handleDelete = () => {
    setLoadingIds([...loadingIds, id]);
    deleteTodo(id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(prevTodo => prevTodo.id !== id)),
      )
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => {
        setLoadingIds(loadingIds.filter(loadId => loadId !== id));
        focusInput();
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleCheckbox}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
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

      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', {
          'is-active': loadingIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
