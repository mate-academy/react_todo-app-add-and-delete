import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { Errors } from '../types/Errors';
import { postDelete } from '../api/todos';

type Props = {
  todo: Todo | null;
  setTypeError: (typeError: Errors) => void;
  setNotificationError: (notificationError: boolean) => void;
  todoList: Todo[];
  setTodoList: (todoList: Todo[] | null) => void;
  loadersTodosId: number[] | null;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  setTypeError,
  setNotificationError,
  todoList,
  setTodoList,
  loadersTodosId,
}) => {
  const [loaderTodo, setLoaderTodo] = useState(false);
  const { id, title, completed } = todo || { id: 0 };

  const deleteClickHandler = () => {
    setLoaderTodo(true);

    if (id) {
      postDelete(id)
        .then(() => {
          const newArray = [...todoList];
          const objFindIndex = newArray.findIndex(obj => obj.id === id);

          newArray.splice(objFindIndex, 1);
          setTodoList(newArray);
          setLoaderTodo(false);
        })
        .catch(() => {
          setTypeError(Errors.REMOVE);
          setNotificationError(true);
        });
    }
  };

  return (
    <div
      className={classNames(
        'todo',
        { completed },
      )}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      <span className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        onClick={deleteClickHandler}
      >
        ×
      </button>

      <div className={classNames(
        'modal',
        'overlay',
        {
          'is-active':
          loaderTodo
          || id === 0
          || loadersTodosId?.includes(id),
        },
      )}
      >
        <div className="
          modal-background
          has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
