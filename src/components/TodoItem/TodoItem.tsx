import React, { useState, useContext } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo } from '../../api/todos';
import { DispatchContext } from '../../Context/Store';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const [isSending, setIsSending] = useState(false);
  const dispatch = useContext(DispatchContext);

  const TodoDeleteButton = () => {
    setIsSending(true);

    deleteTodo(todo.id)
      .then(() => dispatch({
        type: 'deleteTodo',
        payload: todo,
      }))
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableDeleteTodo,
      }))
      .finally(() => setIsSending(false));
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => {}}
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
        onClick={TodoDeleteButton}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': todo.id === 0 || isSending })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
