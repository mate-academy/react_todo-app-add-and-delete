import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  isAdding: boolean;
  newTitle: string;
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (title: string) => void;
};

export const Form: React.FC<Props> = ({
  inputRef,
  isAdding,
  newTitle,
  onSubmit,
  onTitleChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isAdding}
        ref={inputRef}
        autoFocus
      />
    </form>
  );
};
