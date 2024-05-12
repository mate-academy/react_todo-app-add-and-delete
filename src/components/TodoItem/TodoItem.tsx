import React, { useState } from 'react';
import { TypeTodo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteData } from '../../api/todos';

interface Props {
  isTemp?: boolean,
  todo: TypeTodo,
  setIsLoading: (isLoading: boolean) => void,
  setErrorMessage: (message: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>,
  setInputFocus: (focus: boolean) => void,
}

export const TodoItem: React.FC<Props> = ({
  todo, setErrorMessage,
  setTodos, setInputFocus, isTemp
}) => {
  const { id, title, completed } = todo;
  const [isDeleting, setIsDeleting] = useState(false);

  const todoDeleteButton = () => {
    setIsDeleting(true);
    deleteData(id)
      .then(() => {
        setTodos(currectTodos => currectTodos.filter((plan) => plan.id !== id));
        setInputFocus(true);
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        "todo",
        { "completed": completed, }
      )}>
      <label className="todo__status-label" htmlFor={`todo${todo.id}`}>
        <input
          id={`todo${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={todoDeleteButton}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal modal-overlay',
          { 'is-active': isTemp || isDeleting, }
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
