import React from 'react';
import { TypeTodo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteData } from '../../api/todos';
import { Loader } from '../Loader/Loader';

interface Props {
  todo: TypeTodo,
  isLoading: boolean,
  setIsLoading: (isLoading: boolean) => void,
  setErrorMessage: (message: string) => void,
  setTodos: React.Dispatch<React.SetStateAction<TypeTodo[]>>,
  setInputFocus: (focus: boolean) => void,
}

export const Todo: React.FC<Props> = ({
  todo, isLoading, setIsLoading, setErrorMessage, setTodos, setInputFocus
}) => {
  const { id, title, completed } = todo;

  const todoDeleteButton = () => {
    setIsLoading(true);
    deleteData(id)
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to delete todo');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
    setTodos(currectTodos => currectTodos.filter((plan) => plan.id !== id));
    setInputFocus(true);
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
      {isLoading
        ? <Loader />
        : (
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={todoDeleteButton}
          >
            ×
          </button>
        )}

      <div data-cy="TodoLoader" className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
