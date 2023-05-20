import {
  Dispatch,
  FC,
  SetStateAction,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';
import { Errors } from '../../utils/enums';

interface Props {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError:(error:Errors) => void;
  tempTodoId?: number
}

export const TodoInfo:FC<Props> = ({
  todo,
  setTodos,
  setError,
  tempTodoId,
}) => {
  const {
    completed,
    title,
  } = todo;

  // const [isTodoDeleting, setIsTodoDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(tempTodoId === todo.id);

  const handleTodoDelete = () => {
    setIsLoading(true);

    removeTodo(todo.id)
      .then(() => {
        return setTodos((prevTodos: Todo[]) => {
          return prevTodos.filter((currentTodo) => currentTodo.id !== todo.id);
        });
      })
      .catch(() => {
        setError(Errors.Delete);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      className={classNames('todo',
        { completed })}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={handleTodoDelete}
      >
        ×
      </button>

      <div
        className={classNames('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div
          className="modal-background has-background-white-ter"
        />
        <div className="loader" />
      </div>
    </div>
  );
};
