import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { deleteTodo, USER_ID } from '../../api/todos';
import { Error, ErrorType } from '../../types';

type Props = {
  todo: Todo,
  setError: (v: Error) => void,
};

export const TodoItem: React.FC<Props> = ({ todo, setError }) => {
  const [isCompleted, setIsCompleted] = useState(todo.completed);
  const [isBeingRemoved, setIsBeingRemoved] = useState(false);

  const toggleCompletedStatus = () => {
    setIsCompleted(prev => !prev);
  };

  const removeTodo = () => {
    setIsBeingRemoved(true);
    deleteTodo(USER_ID, todo.id)
      .then(response => response)
      .catch(() => {
        setError({
          state: true,
          type: ErrorType.Delete,
        });
      })
      .finally(() => {
        setIsBeingRemoved(false);
      });
  };

  return (
    <CSSTransition
      in
      appear
      timeout={500}
      classNames="fade"
    >
      <div
        className={classNames(
          'todo',
          { completed: isCompleted },
        )}
      >
        <label className="todo__status-label">
          <input
            type="checkbox"
            className="todo__status"
            checked={isCompleted}
            onChange={toggleCompletedStatus}
          />
        </label>
        <span className="todo__title">{todo.title}</span>
        <button
          type="button"
          className="todo__remove"
          onClick={removeTodo}
        >
          ×
        </button>

        {isBeingRemoved && (
          <div className="overlay">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        )}
      </div>
    </CSSTransition>
  );
};
