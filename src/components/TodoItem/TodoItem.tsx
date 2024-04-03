import React from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';

type Props = {
  todo: Todo;
  currentId: number | null;
  onHandleDeleteTodo: (id: number) => void;
};

export const TodoItem: React.FC<Props> = ({
  todo,
  onHandleDeleteTodo,
  currentId,
}) => {
  const { id, completed, title } = todo;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div
        data-cy="Todo"
        className={classNames('todo', { completed: completed })}
      >
        {/*eslint-disable-next-line jsx-a11y/label-has-associated-control*/}
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

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => onHandleDeleteTodo(id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={classNames('modal overlay', {
            'is-active': id === currentId,
          })}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
};
