/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  inputText: string;
  setInputText: (value: string) => void;
  createFunc: () => void;
};

export const Header: React.FC<Props> = ({
  inputRef,
  inputText,
  setInputText,
  createFunc,
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
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          ref={inputRef}
          onChange={e => {
            e.preventDefault();
            setInputText(e.target.value);
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              createFunc();
            }
          }}
        />
      </form>
    </header>
  );
};
