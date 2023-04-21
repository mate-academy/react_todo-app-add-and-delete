/* eslint-disable jsx-a11y/control-has-associated-label */
import classNames from 'classnames';
import React, { useState } from 'react';
import { ErrorAction } from '../../types/ErrorAction';

type Props = {
  isButtonActive: boolean;
  isInputDisabled: boolean;
  setError: (action: ErrorAction) => void;
  addTodo: (title: string) => Promise<void>;
};

export const TodoInput: React.FC<Props> = React.memo(({
  isButtonActive,
  isInputDisabled,
  setError,
  addTodo,
}) => {
  const [input, setInput] = useState('');

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = input.trim();

    if (!title) {
      setError(ErrorAction.EMPTY);
    } else {
      addTodo(title);
    }

    setInput('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isButtonActive },
        )}
      />

      <form
        onSubmit={handleFormSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isInputDisabled}
          value={input}
          onChange={event => setInput(event.target.value)}
        />
      </form>
    </header>
  );
});
