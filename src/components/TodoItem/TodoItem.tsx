import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';

import { Todo } from '../../types/Todo';
import { GlobalContext } from '../../providers';

interface Props {
  todo: Todo,
}

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const {
    loadingTodos,
    handleDelete,
  } = useContext(GlobalContext);

  const [isLoading, setIsLoading] = useState(false);

  const deleteButton = () => {
    handleDelete(todo);
  };

  useEffect(() => {
    if (loadingTodos.find(todoL => todoL.id === todo.id)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [loadingTodos, todo.id]);

  return (
    <div
      key={todo.id}
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={deleteButton}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay',
          {
            'is-active': isLoading || todo.id === 0,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
