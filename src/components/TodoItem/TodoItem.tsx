import React, { useState } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useTodos } from '../Store/Store';

type Props = {
  todo: Todo;
};

const TodoItem: React.FC<Props> = ({ todo }) => {
  const { completed, title, id } = todo;

  const { deleteData, isLoading } = useTodos();

  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: completed,
      })}
      id="todo"
    >
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          id={`${id}`}
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => {
          deleteData(id);
          setSelected(id);
        }}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': (isLoading && todo.id === selected) || todo.id === 0,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
