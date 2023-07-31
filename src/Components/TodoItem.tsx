import classNames from 'classnames';
import { useState } from 'react';
import { Todo } from '../types/Todo';
import { getTodos, removeTodo } from '../api/todos';
import { ErrorStatus } from '../types/ErrorStatus';
import { USER_ID } from '../utils/constants';

interface Props {
  todo: Todo,
  setTodos: (todo: Todo[]) => void,
  setErrorMessage: (msg: string) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo,
  setTodos,
  setErrorMessage,
}) => {
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleDelete = (todoId: number) => {
    setDeleteId(todo.id);

    removeTodo(todoId)
      .then(() => {
        getTodos(USER_ID)
          .then((value) => {
            setTodos(value);
            setDeleteId(null);
          });
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.Delete);
      });
  };

  return (
    <div
      key={todo.id}
      className={classNames('todo',
        { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
        />
      </label>

      <span className="todo__title">{todo.title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={() => handleDelete(todo.id)}
      >
        х
      </button>

      {false && (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )}

      <div className={
        classNames('modal overlay',
          { 'is-active': todo.id === 0 || deleteId === todo.id })
      }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
