/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import classNames from 'classnames';

type Props = {
  isActiveButton: boolean,
  onSubmit: (title: string) => void,
  isDisabled: boolean
};

export const TodoInput: React.FC<Props> = React.memo(({
  isActiveButton,
  onSubmit,
  isDisabled,
}) => {
  const [input, setInput] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames(
          'todoapp__toggle-all',
          { active: isActiveButton },
        )}
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
});
