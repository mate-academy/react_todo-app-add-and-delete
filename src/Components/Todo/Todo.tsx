/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useContext, useState } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import classNames from 'classnames';
import { Actions, DispatchContext, StateContext } from '../../Store';
import { wait } from '../../utils/fetchClient';
import { deleteTodos } from '../../api/todos';

type Props = {
  todo: TodoType;
};

export const Todo: React.FC<Props> = ({ todo }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { tempTodo, isRemoving } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const isCompleted = () => {
    setIsLoading(true);

    return wait(300).then(() => {
      dispatch({ type: Actions.markCompleted, id: todo.id });
      setIsLoading(false);
    });
  };

  // console.log(isLoading && todo.completed);

  const handleDelete = () => {
    setIsLoading(true);

    deleteTodos(todo.id)
      .then(() => {
        dispatch({ type: Actions.deleteTodo, id: todo.id });
        setIsLoading(false);
      })
      .catch(error => {
        dispatch({
          type: Actions.setErrorLoad,
          payload: '',
        });
        dispatch({
          type: Actions.setErrorLoad,
          payload: 'Unable to delete a todo',
        });
        setIsLoading(false);

        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', {
        completed: todo.completed,
      })}
    >
      <label htmlFor={`todo-status-${todo.id}`} className="todo__status-label">
        <input
          id={`todo-status-${todo.id}`}
          data-cy="TodoStatus"
          type="checkbox"
          onChange={isCompleted}
          className="todo__status"
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
        onClick={handleDelete}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            isLoading ||
            tempTodo?.id === todo.id ||
            (isRemoving && todo.completed),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
