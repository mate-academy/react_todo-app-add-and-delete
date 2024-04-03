import React from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (event: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Form: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onSubmit,
  isDisabled,
  inputRef,
}) => {
  return (
    <form
      onSubmit={event => {
        onSubmit(event);
      }}
    >
      <input
        data-cy="NewTodoField"
        type="text"
        value={newTitle}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={isDisabled}
        onChange={event => setNewTitle(event.target.value)}
      />
    </form>
  );
};
