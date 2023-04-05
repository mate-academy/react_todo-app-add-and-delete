import React from 'react';
import { Todo } from '../../types/Todo';
import { Loader } from '../Loader';

type Props = {
  todoTitle: Pick<Todo, 'title'>,
};

export const TodoItemLoader: React.FC<Props> = ({ todoTitle }) => {
  return (
    <div className="todo">
      <label className="todo__status-label">
        <input type="checkbox" className="todo__status" />
      </label>

      <span className="todo__title">{todoTitle.title}</span>
      <button
        type="button"
        aria-label="remove todo"
        className="todo__remove"
      >
        ×
      </button>

      <Loader isActive />
    </div>
  );
};
