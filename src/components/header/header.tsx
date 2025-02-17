import React, { RefObject } from 'react';
import classNames from 'classnames';

type Props = {
  areTodosActive: boolean;
  handleFormSubmit: (event: React.FormEvent) => void;
  todoText: string;
  setTodoText: (todoText: string) => void;
  isSubmitting: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  areTodosActive,
  handleFormSubmit,
  todoText,
  setTodoText,
  isSubmitting,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: areTodosActive,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoText}
          onChange={event => setTodoText(event.target.value)}
          disabled={isSubmitting}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
