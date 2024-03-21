import { useCallback, useContext, useEffect, useState } from 'react';
import cn from 'classnames';
import { ErrorMessage, Todo } from '../types';
import { deleteTodo, patchTodo } from '../api/todos';
import { TEMP_ITEM_ID } from '../utils';
import {
  InputFieldRefContext,
  IsDeletingCompletedContext,
  SetErrorMessageContext,
  SetTodosContext,
} from '../Contexts';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState(false);

  const setTodos = useContext(SetTodosContext);
  const inputFieldRef = useContext(InputFieldRefContext);
  const setErrorMessage = useContext(SetErrorMessageContext);
  const isDeletingCompleted = useContext(IsDeletingCompletedContext);

  useEffect(() => {
    if (todo.id === TEMP_ITEM_ID || (todo.completed && isDeletingCompleted)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [todo, isDeletingCompleted]);

  const handleStatusChange = useCallback(
    (todoChanged: Todo) => {
      setIsLoading(true);
      setErrorMessage(ErrorMessage.noError);

      patchTodo({
        ...todoChanged,
        completed: !todoChanged.completed,
      })
        .then(patchedTodo => {
          setTodos(prevTodos => {
            return prevTodos.map(prevTodo => {
              return prevTodo.id === patchedTodo.id ? patchedTodo : prevTodo;
            });
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [setTodos, setErrorMessage],
  );

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      setIsLoading(true);
      setErrorMessage(ErrorMessage.noError);

      deleteTodo(todoId)
        .then(() => {
          setTodos(prevTodos => {
            return prevTodos.filter(prevTodo => prevTodo.id !== todoId);
          });
        })
        .catch(() => setErrorMessage(ErrorMessage.delete))
        .finally(() => {
          if (inputFieldRef?.current) {
            inputFieldRef.current.focus();
          }

          setIsLoading(false);
        });
    },
    [setTodos, inputFieldRef, setErrorMessage],
  );

  return (
    <div
      data-cy="Todo"
      key={todo.id}
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      {/* eslint-disable-next-line */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => handleStatusChange(todo)}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleTodoDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal', 'overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
