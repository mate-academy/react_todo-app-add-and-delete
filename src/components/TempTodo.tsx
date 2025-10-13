import { useEffect, useRef } from 'react';
import React from 'react';
import { Todo } from '../types/Todo';

interface Props {
  tempTodo: Todo;
}

export const TempTodo: React.FC<Props> = ({ tempTodo }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div key={tempTodo.id} className="todo" data-cy="Todo">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="todo__status-label">
        <input
          ref={inputRef}
          type="checkbox"
          className="todo__status"
          checked={false}
          readOnly
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {tempTodo.title}
      </span>
      <button type="button" className="todo__remove" disabled>
        ×
      </button>

      <div data-cy="TodoLoader" className="modal overlay is-active">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
