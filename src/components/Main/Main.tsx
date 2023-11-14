import React from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  setErrorMassege: (error: string) => void,
  hideError: () => void,
  spinner: boolean,
  spinnerStatus: (value: boolean) => void,
  cuurentId: number,
  changeCurrentId: (id: number) => void,
};

export const Main: React.FC<Props> = ({
  todos,
  removeTodo,
  setErrorMassege,
  hideError,
  spinner,
  spinnerStatus,
  cuurentId,
  changeCurrentId,
}) => {
  const handleClickDeleteTodo = (todoId: number) => {
    spinnerStatus(true);
    changeCurrentId(todoId);
    deleteTodo(todoId)
      .then(response => {
        if (response) {
          removeTodo(todoId);
        }
      })
      .catch(() => {
        setErrorMassege('Unable to delete a todo');
        hideError();
      })
      .finally(() => spinnerStatus(false));
  };

  return (
    <section className="todoapp__main">
      {todos.map(({ title, id }) => (
        <div key={id} className="todo">
          <label className="todo__status-label">
            <input
              type="checkbox"
              className="todo__status"
            />
          </label>

          <span className="todo__title">{title}</span>
          <button
            onClick={() => handleClickDeleteTodo(id)}
            type="button"
            className="todo__remove"
          >
            ×
          </button>

          <div className={`modal overlay ${cuurentId === id && spinner && 'is-active'}`}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
