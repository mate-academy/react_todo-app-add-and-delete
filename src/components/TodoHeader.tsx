import React, { useEffect } from 'react';

type Props = {
  newTodoTitle: string;
  onTitleChange: (value: string) => void;
  onSubmit: (value: React.FormEvent) => void;
  isDisabled: boolean;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoHeader: React.FC<Props> = ({
  newTodoTitle,
  onTitleChange,
  onSubmit,
  isDisabled,
  isAdding,
  inputRef,
}) => {
  useEffect(() => {
    inputRef.current?.focus();
  }, [isAdding, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={element => onTitleChange(element.target.value.trimStart())}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
