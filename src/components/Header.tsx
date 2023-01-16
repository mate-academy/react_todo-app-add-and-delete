/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useRef } from 'react';

type Props = {
  title: string;
  setTitle: (arg: string) => void;
  setIsHidden: (arg: boolean) => void;
  handleEnterPress: (event: React.KeyboardEvent) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = (
  {
    title,
    setTitle,
    setIsHidden,
    handleEnterPress,
    isAdding,
  },
) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={e => e.preventDefault()}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding === true}
          onChange={e => {
            setTitle(e.target.value);
            setIsHidden(true);
          }}
          onKeyUp={e => handleEnterPress(e)}
        />
      </form>
    </header>
  );
};
