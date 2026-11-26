import React from 'react';
import classNames from 'classnames';

type Props = {
  showToggle: boolean;
  allCompleted: boolean;
  newTitle: string;
  isAdding: boolean;
  onChangeTitle: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  showToggle,
  allCompleted,
  newTitle,
  isAdding,
  onChangeTitle,
  onSubmit,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {showToggle && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: allCompleted,
          })}
          data-cy="ToggleAllButton"
          disabled
        />
      )}

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => onChangeTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};

export default Header;
