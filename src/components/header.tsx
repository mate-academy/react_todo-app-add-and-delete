import React, { FormEvent, RefObject } from 'react';
import classNames from 'classnames';

type Props = {
  countOfTodos: number;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  value: string;
  setValue: (value: string) => void;
  waiting: boolean;
  inputRef: RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  countOfTodos,
  handleSubmit,
  value,
  setValue,
  waiting,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', {
          active: countOfTodos === 0,
        })}
        data-cy="ToggleAllButton"
        disabled
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          value={value}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setValue(event.target.value)}
          disabled={waiting}
        />
      </form>
    </header>
  );
};
