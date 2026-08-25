import React, { forwardRef } from 'react';

type Props = {
  title: string;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  disabled: boolean;
};

export const NewTodoField = forwardRef<HTMLInputElement, Props>(
  ({ title, onTitleChange, onSubmit, disabled }, ref) => {
    return (
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => onTitleChange(event.target.value)}
          ref={ref}
          disabled={disabled}
        />
      </form>
    );
  },
);

NewTodoField.displayName = 'NewTodoField';
