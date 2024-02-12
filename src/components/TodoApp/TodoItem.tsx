import React, { useContext } from 'react';

import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { DispatchContext, StateContext } from '../Context/StateContext';
import { deleteTodo } from '../../api/todos';
import { Notification } from '../../types/Notification';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { coveredTodoIds } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const { id, title, completed } = todo;

  const showLoader = () => {
    dispatch({
      type: 'showLoader',
      payload: [...coveredTodoIds, id],
    });

    setTimeout(() => dispatch({
      type: 'showLoader',
      payload: [0],
    }), 500);
  };

  const handlerChageComleted = () => {
    dispatch({
      type: 'markCompleted',
      iD: id,
    });

    showLoader();
  };

  const removeTodo = () => {
    showLoader();

    deleteTodo(id)
      .then(() => {
        dispatch({
          type: 'removeTodo',
          iD: id,
        });
      })
      .catch(() => {
        dispatch({
          type: 'showNotification',
          notification: Notification.DELETE_TODO,
        });
      });
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
          onChange={handlerChageComleted}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={removeTodo}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': coveredTodoIds.includes(id),
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
