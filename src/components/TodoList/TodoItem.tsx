import React, { useContext } from 'react';

import cn from 'classnames';
import { TodoContext } from '../../Context/TodoContext';
import { Todo } from '../../types/Todo';
import { deleteTodos } from '../../api/todos';
import { Errors } from '../../types/Errors';

type Props = {
  todoInfo: Todo,
};

export const TodoItem: React.FC<Props> = ({ todoInfo }) => {
  const {
    setTodos,
    setHasError,
    setErrorType,
    setLoadId,
    loadId,
  } = useContext(TodoContext);

  const { id, completed, title } = todoInfo;

  function handleDelete(todoId: number) {
    const newLoadIds = [...loadId, id];

    setLoadId(newLoadIds);
    deleteTodos(todoId)
      .then(() => setTodos(prev => prev.filter(todo => todo.id !== todoId)))
      .catch(() => {
        setHasError(true);
        setErrorType(Errors.Delete);
      })
      .finally(() => setLoadId([]));
  }

  return (
    <div
      data-cy="Todo"
      className={cn('todo', { completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => handleDelete(todoInfo.id)}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being updated */}
      <div
        data-cy="TodoLoader"
        className={cn('modal overlay',
          { 'is-active': loadId.includes(id) })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
