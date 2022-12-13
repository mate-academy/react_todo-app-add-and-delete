import classNames from 'classnames';
import { Dispatch, SetStateAction, useContext } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, getActiveTodos } from '../../api/todos';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  todo: Todo,
  isDeleting: number,
  setIsDeleting: Dispatch<SetStateAction<number>>
  setVisibleTodos: Dispatch<SetStateAction<Todo[] | null>>
  setDeleteErrorStatus: Dispatch<SetStateAction<boolean>>
  // eslint-disable-next-line max-len
  setErrorStatus: (setEmptyTitleError: Dispatch<SetStateAction<boolean>>) => void;
}

export const TodoInfo: React.FC<Props> = (props) => {
  const {
    todo,
    isDeleting,
    setIsDeleting,
    setVisibleTodos,
    setDeleteErrorStatus,
    setErrorStatus,
  } = props;

  const user = useContext(AuthContext);

  return (
    <>
      <div
        data-cy="Todo"
        className={classNames(
          { todo: true },
          { completed: todo.completed },
        )}
        // key={todo.id}
      >
        {todo.id === isDeleting && (
          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}

        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => {
            setIsDeleting(todo.id);
            if (user) {
              deleteTodo(todo.id)
                .then(() => getActiveTodos(user.id))
                .then(userTodos => {
                  setVisibleTodos(userTodos);
                  setIsDeleting(0);
                })

                .catch(() => {
                  setErrorStatus(setDeleteErrorStatus);
                  setIsDeleting(0);
                });
            }
          }}
        >
          ×
        </button>

        {/* <div data-cy="TodoLoader" className="modal overlay">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div> */}
      </div>
    </>
  );
};
