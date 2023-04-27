import React, { FC, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { removeTodo } from '../../api/todos';
import { ErrorType } from '../../types/Error';

type Props = {
  todo: Todo;
  isLoading: boolean;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>
  setError: React.Dispatch<React.SetStateAction<ErrorType>>
  setProcessings: React.Dispatch<React.SetStateAction<number[]>>;
};

export const TodoTask: FC<Props> = ({
  todo,
  setTodos,
  setError,
  isLoading,
  setProcessings,
}) => {
  const [isEdited] = useState(false);
  const handleOnClickRemoveTodo = async () => {
    try {
      setProcessings(prevState => [...prevState, todo.id]);
      await removeTodo(todo.id);
      setTodos(prevState => prevState.filter(item => item.id !== todo.id));
    } catch (err) {
      setError(ErrorType.DELETE);
    } finally {
      setProcessings(
        prevState => prevState.filter(item => item !== todo.id),
      );
    }
  };

  return (
    <div
      className={classNames('todo',
        {
          completed: todo.completed,
        })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
        />
      </label>

      {isEdited
        ? (
          <form>
            <input
              type="text"
              className="todo__title-field"
              placeholder="Empty todo will be deleted"
              value="Todo is being edited now"
            />
          </form>
        )
        : (
          <>
            <span className="todo__title">{todo.title}</span>
            <button
              type="button"
              className="todo__remove"
              onClick={handleOnClickRemoveTodo}
            >
              ×
            </button>
          </>
        )}

      <div className={classNames('modal overlay', {
        'is-active': isLoading,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
