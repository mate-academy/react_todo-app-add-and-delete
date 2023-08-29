import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import * as todoService from '../../../api/todos';
import { Todo } from '../../../types/Todo';
import { useTodo } from '../../../api/useTodo';
import { Error } from '../../../types/Error';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    setTodos,
    setErrorMessage,
    tempTodo,
    toBeCleared,
    setCleared,
  } = useTodo();

  const [isTodoLoading, setIsTodoLoading] = useState(false);
  const isEditable = false;

  const handleDelete = (todoId: number, errorMessage = Error.Delete) => {
    setIsTodoLoading(true);

    todoService.deleteTodo(todoId)
      .then(() => setTodos(currTodos => [...currTodos]
        .filter(currTodo => currTodo.id !== todoId)))
      .catch(() => {
        setErrorMessage(errorMessage);
      })
      .finally(() => {
        setIsTodoLoading(false);
        setCleared([]);
      });
  };

  useEffect(() => {
    if (tempTodo) {
      setIsTodoLoading(true);
    }

    if (toBeCleared.includes(todo.id)) {
      handleDelete(todo.id, Error.Clear);
    }
  }, [toBeCleared]);

  return (
    <li
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      {isEditable ? (
        <form>
          <input
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      ) : (
        <>
          <span className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="destroy todo__remove"
            onClick={() => handleDelete(todo.id)}
          >
            &times;
          </button>
        </>
      )}

      <div
        className={classNames('modal overlay', {
          'is-active': isTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
