import React from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';

type Props = {
  todo: Todo
  handleTodoStatusChange: (id: number) => void
  setErrorMessage?: (message: string) => void
  removeTodo?: (id: number) => void
  loadingItems: number[]
  setLoadingItems: (id: (prevState: number[]) => number[]) => void
};

export const TodoElement: React.FC<Props> = ({
  todo,
  handleTodoStatusChange,
  setErrorMessage,
  removeTodo,
  loadingItems,
  setLoadingItems,
}) => {
  const handleDelete = (id: number) => {
    setLoadingItems((prevState) => {
      return [...prevState, id];
    });
    client.delete(`/todos/${id}`)
      .then(() => {
        if (removeTodo === undefined) {
          return;
        }

        removeTodo(id);
      })
      .catch(() => {
        if (setErrorMessage === undefined) {
          return;
        }

        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => setLoadingItems((prevState) => {
        return prevState.filter((stateId) => id !== stateId);
      }));
  };

  const handleLoading = (id: number): boolean => {
    return loadingItems.some((item) => item === id);
  };

  return (
    <div
      data-cy="Todo"
      className={
        classNames(['todo'], { completed: todo.completed })
      }
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onChange={() => {
            handleTodoStatusChange(todo.id);
          }}
          checked={todo.completed}
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
        onClick={() => handleDelete(todo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', { 'is-active': handleLoading(todo.id) })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
