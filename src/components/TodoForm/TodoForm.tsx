import React, { useEffect, useRef } from 'react';

interface Props {
  newTodoTitle: string;
  isSubmitting: boolean;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TodoForm: React.FC<Props> = ({
  newTodoTitle,
  isSubmitting,
  onTitleChange,
  onSubmit,
}) => {
  const todoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        ref={todoField}
        onChange={onTitleChange}
        disabled={isSubmitting}
      />
    </form>
  );
};
