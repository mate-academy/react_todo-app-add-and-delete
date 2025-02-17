/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { Todo } from '../types/Todo';
import { deleteTodos } from '../api/todos';
import { ErrorMessage } from '../types/ErrorMessage';

interface Props {
  todo: Todo;
  isTemp: boolean;
  deletingIds: number[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (message: string) => void;
  setDeletingIds: React.Dispatch<React.SetStateAction<number[]>>;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isTemp,
  deletingIds,
  setTodos,
  setErrorMessage,
  setDeletingIds,
}) => {
  const handleDeleteClick = (todoId: number) => {
    setDeletingIds(prevIds => [...prevIds, todoId]);

    deleteTodos(todoId)
      .then(() =>
        setTodos((prevTodos: Todo[]) =>
          prevTodos.filter(todoItem => todoItem.id !== todoId),
        ),
      )
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableDelete);
      })
      .finally(() => {
        setDeletingIds(prevIds => prevIds.filter(id => id !== todoId));
      });
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed && 'completed'}`}
      key={todo.id}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDeleteClick(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={`modal overlay ${(isTemp || deletingIds.includes(todo.id)) && 'is-active'}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
