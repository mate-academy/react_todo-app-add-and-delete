import React, { FC, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';

interface Props {
  todo: Todo,
  todoId?: number,
  isDeleted?: boolean,
  deleteTodo?: (todo: Todo) => void,
}

export const TodoItem: FC<Props> = React.memo(({
  todo,
  isDeleted,
  deleteTodo = () => {},
  todoId,
}) => {
  const { completed, title } = todo;
  const isLoad = todo.id === todoId;
  const [isLoading, setIsLoading] = useState(isLoad);

  const handeleDelete = async () => {
    setIsLoading(true);

    await deleteTodo(todo);

    setIsLoading(false);
  };

  return (
    <div className={cn('todo', {
      completed,
    })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span className="todo__title">{title}</span>
      <button
        type="button"
        className="todo__remove"
        onClick={handeleDelete}
      >
        ×
      </button>

      <div className={cn('modal overlay', {
        'is-active': isLoading || isDeleted,
      })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
