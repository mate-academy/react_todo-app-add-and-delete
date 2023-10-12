import React from 'react';
import { Todo } from '../types/Todo';

type Props = {
  tempTodos: Todo,
};

export const TodoItem: React.FC<Props> = React.memo(({
  tempTodos,
}) => {
  const {
    id,
    title,
    completed,
  } = tempTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This todo is in loadind state */}
      <div id={`${id}`} data-cy="Todo" className="todo">
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            checked={!completed}
            readOnly
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {title}
        </span>

        <button type="button" className="todo__remove" data-cy="TodoDelete">
          ×
        </button>

        {/* 'is-active' class puts this modal on top of the todo */}
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </section>
  );
});
