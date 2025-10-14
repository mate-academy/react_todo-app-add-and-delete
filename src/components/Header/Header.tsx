import React from 'react';

type Props = {
  newTitle: string;
  setNewTitle: (title: string) => void;
  onAdd: (event: React.FormEvent) => void;
  disabled?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  onAdd,
  disabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />
      <form onSubmit={onAdd}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          autoFocus
          disabled={disabled}
        />
      </form>
    </header>
  );
};
