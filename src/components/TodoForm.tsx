import React, { RefObject } from 'react';

type Props = {
  title: string;
  isSubmitting: boolean;
  onTitleChange: (title: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  titleFieldRef: RefObject<HTMLInputElement>;
};

export const TodoForm: React.FC<Props> = ({
  title,
  isSubmitting,
  onTitleChange,
  onSubmit,
  titleFieldRef,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        disabled={isSubmitting}
        onChange={event => onTitleChange(event.target.value)}
        ref={titleFieldRef}
      />
    </form>
  );
};
