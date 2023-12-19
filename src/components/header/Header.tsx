/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import cn from 'classnames';

import '../../styles/header.scss';

interface Props {
  onSubmit: (event: React.FormEvent) => void,
  inputValue: string,
  changeInputValue: (el: string) => void,
  isLoading: boolean,
  todoInputRef: React.RefObject<HTMLInputElement>,
}

export const Header: React.FC<Props> = ({
  onSubmit,
  inputValue,
  changeInputValue,
  isLoading,
  todoInputRef,
}) => {
  const handleTodoFocus = (event: React.FormEvent) => {
    onSubmit(event);

    todoInputRef.current?.focus();
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={event => handleTodoFocus(event)}>
        <input
          ref={todoInputRef}
          data-cy="NewTodoField"
          type="text"
          className={cn('todoapp__new-todo', { disabled: isLoading })}
          // className="todoapp__new-todo"
          value={inputValue}
          onChange={event => changeInputValue(event.target.value)}
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
