import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { patchTodo, removeTodo } from '../../api/todos';
import { Errors } from '../../utils/enums';

interface Props {
  todo: Todo;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
  setError:(error:Errors) => void;
  onUpdate:(Todo: Todo) => void;
  tempTodoId?: number;
}

export const TodoInfo:FC<Props> = ({
  todo,
  setTodos,
  setError,
  onUpdate,
  tempTodoId,
}) => {
  const {
    completed,
    title,
    id,
  } = todo;

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

  const handleTodoUpdate = useCallback(async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    event?.preventDefault();

    const todoData = {
      ...todo,
      completed: event.target.checked,
    };

    try {
      setIsLoading(true);

      const updatedTodo = await patchTodo(id, todoData);

      onUpdate(updatedTodo);
    } catch {
      setError(Errors.Update);
    }

    setIsLoading(false);
  }, [completed]);

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
          onChange={handleTodoUpdate}
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
