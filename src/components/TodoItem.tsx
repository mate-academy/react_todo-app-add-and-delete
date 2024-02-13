import React, { useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { deleteTodo } from '../api/todos';
import { DispatchContext, StateContext } from './TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;
  const { loading } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const isLoading = loading.isLoading && loading.todoIds.includes(id);

  const handleChangeCompleted = () => {
    dispatch({
      type: 'changeCompleted',
      payload: id,
    });
  };

  const handleDeleteTodo = () => {
    dispatch({
      type: 'setLoading',
      payload: {
        isLoading: true,
        todoIds: [id],
      },
    });

    deleteTodo(id)
      .then(() => dispatch({
        type: 'deleteTodo',
        payload: id,
      }))
      .catch(() => dispatch({
        type: 'setErrorMessage',
        payload: 'Unable to delete a todo',
      }))
      .finally(() => dispatch({
        type: 'setLoading',
        payload: {
          isLoading: false,
        },
      }));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handleChangeCompleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
