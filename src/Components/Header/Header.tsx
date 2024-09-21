import React from 'react';

type Props = {
  onSetTitle: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  title: string;
  onFocus: React.RefObject<HTMLInputElement>;
  inputTodo: boolean;
};

export const Header: React.FC<Props> = ({
  onSetTitle,
  onSubmit,
  title,
  onFocus,
  inputTodo,
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
          value={title}
          ref={onFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => onSetTitle(e.target.value)}
          disabled={!inputTodo}
        />
      </form>
    </header>
  );
};
