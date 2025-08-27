import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  onTodoDelete: (todoId: number) => Promise<boolean>;
};

export const TodoItem: React.FC<Props> = ({ todo, onTodoDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const todoId = todo.id + '';

  const handleOnDelete = async () => {
    setIsDeleting(true);

    const isSuccess = await onTodoDelete(todo.id);

    if (!isSuccess) {
      setIsDeleting(false);
    }
  };

  return (
    <div
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
      <label className="todo__status-label" htmlFor={todoId}>
        <input
          id={todoId}
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
        onClick={handleOnDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active': todo.id === 0 || isDeleting,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
