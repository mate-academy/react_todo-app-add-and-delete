import React from 'react';

type Props = {
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  onSubmit,
  onTitleChange,
  title,
  isDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          disabled={isDisabled}
          ref={inputRef}
          placeholder="What needs to be done?"
          value={title}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
