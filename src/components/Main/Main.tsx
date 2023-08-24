import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo } from '../../api/todos';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  setErrorMassege: (error: string) => void,
  hideError: () => void,
};

export const Main: React.FC<Props> = ({
  todos,
  removeTodo,
  setErrorMassege,
  hideError,
}) => {
  const [isSpinner, setIsSpinner] = useState(false);
  const [cuurentId, setCurrentId] = useState(0);

  const handleClickDeleteTodo = (todoId: number) => {
    setIsSpinner(true);
    setCurrentId(todoId);
    deleteTodo(todoId)
      .then(response => {
        if (response) {
          removeTodo(todoId);
          setIsSpinner(false);
        }
      })
      .catch(() => {
        setErrorMassege('Unable to delete a todo');
        hideError();
        setTimeout(() => setIsSpinner(false), 5000);
      });
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

          <div className={`modal overlay ${cuurentId === id && isSpinner && 'is-active'}`}>
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      ))}
    </section>
  );
};
