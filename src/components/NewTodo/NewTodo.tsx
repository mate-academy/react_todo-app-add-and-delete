/* eslint-disable react/display-name */
import React, { forwardRef } from 'react';
import '../../styles/todo.scss';

type Props = {
  newTodo: string;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const NewTodo = forwardRef<HTMLInputElement, Props>(
  ({ newTodo, onSubmit, onChange, disabled }, ref) => {
    return (
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodo}
          onChange={event => onChange(event.target.value)}
          ref={ref}
          disabled={disabled}
        />
      </form>
    );
  },
);
