import React, { useContext, useEffect, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { TodosContext } from '../../utils/TodosContext';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../../utils/ErrorContextProvider';
import { Errors } from '../../types/Errors';

type Props = Todo & { isLoading: boolean };

export const TodoItem: React.FC<Props> = ({
  title,
  completed,
  isLoading,
  id,
}) => {
  const [currentTitle] = useState(title);
  const [showModal, setShowModal] = useState(isLoading);

  const { setTodos } = useContext(TodosContext);
  const { showError } = useContext(ErrorContext);

  useEffect(() => setShowModal(isLoading), [isLoading]);

  const deleteHandler = () => {
    setShowModal(true);

    deleteTodo(id)
      .then(() => setTodos((todos) => todos.filter(todo => todo.id !== id)))
      .catch(() => showError(Errors.Delete))
      .finally(() => setShowModal(false));
  };

  return (
    <div className={cn('todo', { completed })}>
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span className="todo__title">{currentTitle}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={deleteHandler}
      >
        ×
      </button>

      <div className={cn('modal overlay', { 'is-active': showModal })}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
