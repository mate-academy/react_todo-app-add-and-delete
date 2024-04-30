/* eslint-disable jsx-a11y/label-has-associated-control */
import { FC, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { useTodos } from '../../providers';

interface Props {
  todo: Todo;
  defaultIsUpdate?: boolean;
}

export const TodoItem: FC<Props> = ({ todo, defaultIsUpdate = false }) => {
  const [isUpdate, setIsUpdate] = useState(defaultIsUpdate);
  const { onDeleteTodo } = useTodos();

  useEffect(() => {
    setIsUpdate(defaultIsUpdate);
  }, [defaultIsUpdate, todo]);

  const handleDelte = () => {
    onDeleteTodo(todo.id);
    setIsUpdate(true);
  };

  return (
    <div
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
        onClick={handleDelte}
      >
        ×
      </button>
      <div
        data-cy="TodoLoader"
        className={classNames('modal', 'overlay', { 'is-active': isUpdate })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
