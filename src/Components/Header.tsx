import React from 'react';
import classNames from 'classnames';

type Props = {
  newTodoText: string;
  onChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  newTodoRef: React.RefObject<HTMLInputElement>;
  disabledInput?: boolean;
  allCompleted: boolean;
  onToggleAll: () => void;
  disabledFooter?: boolean;
};
export const Header: React.FC<Props> = ({
  newTodoText,
  onChange,
  onSubmit,
  newTodoRef,
  disabledInput = false,
  allCompleted,
  onToggleAll,
  disabledFooter = false,
}) => (
  <header className="todoapp__header">
    <button
      type="button"
      className={classNames('todoapp__toggle-all', { active: allCompleted })}
      data-cy="ToggleAllButton"
      onClick={onToggleAll}
      disabled={disabledFooter}
    />
    <form onSubmit={onSubmit}>
      <input
        data-cy="NewTodoField"
        ref={newTodoRef}
        value={newTodoText}
        onChange={e => onChange(e.target.value)}
        disabled={disabledInput}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
      />
    </form>
  </header>
);
