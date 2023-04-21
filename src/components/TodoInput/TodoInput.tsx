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

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      const title = input.trim();

      if (title) {
        await addTodo(title);
        setInput('');
      } else {
        throw new Error();
      }
    } catch {
      setError(ErrorAction.EMPTY);
    }
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
