/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodos, editTodos } from '../api/todos';
import { SetTodosContext } from '../Contexts/TodosContext';
import { SetErrorContext } from '../Contexts/ErrorContext';
import { ErrorMessage } from '../types/Error';
import { SetInputRef } from '../Contexts/InputRefContext';
import { IsDeletingContext } from '../Contexts/DeletingContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const setTodos = useContext(SetTodosContext);
  const setErrorMessage = useContext(SetErrorContext);
  const [isLoading, setIsLoading] = useState(false);
  const setInputFocused = useContext(SetInputRef);
  const isDeleting = useContext(IsDeletingContext);

  useEffect(() => {
    if (todo.id === 0 || (todo.completed && isDeleting)) {
      setIsLoading(true);
    }
  }, [todo.id, isDeleting, todo.completed]);

  const handleTodoCheck = () => {
    const updatedTodo = { ...todo, completed: !todo.completed };

    setIsLoading(true);

    editTodos(updatedTodo)
      .then(() => {
        setTodos(prevTodos => {
          return prevTodos.map(prevTodo => {
            if (prevTodo.id === todo.id) {
              return updatedTodo;
            }

            return prevTodo;
          });
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleTodoDelete = useCallback(
    (todoId: number) => {
      setIsLoading(true);

      deleteTodos(todoId)
        .then(() => {
          setTodos(prevTodos => {
            return prevTodos.filter(prevTodo => prevTodo.id !== todoId);
          });
        })
        .catch(() => setErrorMessage(ErrorMessage.delete))
        .finally(() => {
          setIsLoading(false);
          setInputFocused(true);
        });
    },
    [setTodos, setErrorMessage, setInputFocused],
  );

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleTodoCheck}
        />
      </label>

      <>
        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => handleTodoDelete(todo.id)}
        >
          ×
        </button>
      </>

      {/* {isEditing && (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value="Todo is being edited now"
          />
        </form>
      )} */}

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
