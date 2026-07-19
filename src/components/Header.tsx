import React from 'react';

interface Props {
  newTodoTitle: string;
  isAdding: boolean;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  newTodoTitle,
  isAdding,
  onTitleChange,
  onSubmit,
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
          placeholder="What needs to be done?"
          ref={inputRef}
          value={newTodoTitle}
          disabled={isAdding}
          onChange={e => onTitleChange(e.target.value)}
        />
      </form>
    </header>
  );
};
