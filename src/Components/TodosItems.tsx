import React, { useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { useTodo } from '../Hooks/UseTodo';
import { deleteTodos, getTodos, updateTodos } from '../api/todos';
import { ErrorMessage } from '../Enum/ErrorMessage';
import { USER_ID } from '../variables/userId';

type Props = {
  items: Todo;
  isProcessed: boolean;
  setErrorVisibility: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodosItems: React.FC<Props> = ({
  items,
  isProcessed,
  setErrorVisibility,
}) => {
  const {
    todos, setTodos, setIsError,
  } = useTodo();
  const [showLoadind, setShowLoadind] = useState(isProcessed);

  const handleCompleteTodo = (todoId: number) => {
    setShowLoadind(true);

    updateTodos(todoId, { completed: !items.completed })
      .then(() => {
        getTodos(USER_ID)
          .then((data) => {
            setTodos(data);
          })
          .catch(() => {
            setIsError(ErrorMessage.UPDATE);
            setErrorVisibility(true);
          })
          .finally(() => setShowLoadind(false));
      });
  };

  const handleDeleteTodo = (id: number) => {
    setShowLoadind(true);
    const filterTodos = todos.filter(todoItem => todoItem.id !== id);

    deleteTodos(items.id)
      .then(() => {
        getTodos(USER_ID)
          .then(() => setTodos(filterTodos))
          .catch(() => {
            setIsError(ErrorMessage.DELETE);
            setErrorVisibility(true);
          })
          .finally(() => setShowLoadind(false));
      });
  };

  return (
    <>
      <div
        className={classNames(
          'todo',
          { completed: items.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={items.completed}
            onChange={() => handleCompleteTodo(items.id)}
          />
        </label>

        <span className="todo__title">{items.title}</span>

        {/* Remove button appears only on hover */}
        <button
          type="button"
          className="todo__remove"
          onClick={() => handleDeleteTodo(items.id)}
        >
          ×
        </button>

        {/* overlay will cover the todo while it is being updated */}
        {/* 'is-active' class puts this modal on top of the todo */}
        {(showLoadind || isProcessed) && (
          <div className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </>
  );
};
