import React from 'react';

interface Props {
  title: string;
  changeTitle: (str: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  inProcess: boolean;
  onSubmit: (event: React.FormEvent) => void;
}

export const Header: React.FC<Props> = ({
  title,
  changeTitle: setTitle,
  inputRef,
  inProcess,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setTitle(e.target.value)}
          value={title}
          ref={inputRef}
          disabled={inProcess}
        />
      </form>
    </header>
  );
};
