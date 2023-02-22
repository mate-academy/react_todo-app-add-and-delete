/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { ChangeEvent, FormEvent, useState } from 'react';

type Props = {
  addNewTodo: (ard: string) => void
};

export const Header: React.FC<Props> = ({ addNewTodo }) => {
  const [input, setInput] = useState<string>('');
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(false);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsFormDisabled(true);

    await addNewTodo(input);

    setIsFormDisabled(false);
    setInput('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={handleInput}
          disabled={isFormDisabled}
        />
      </form>
    </header>
  );
};
