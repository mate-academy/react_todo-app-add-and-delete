import React, { useState } from 'react';

type Props = {
  addTodo: (title: string) => void,
  updateError: React.Dispatch<React.SetStateAction<string>>,
  isLoading: boolean,
};

export const Header: React.FC<Props> = ({
  addTodo,
  updateError,
  isLoading,
}) => {
  const [value, setValue] = useState('');
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!value.trim()) {
      updateError('Title can\'t be empty');
    } else {
      addTodo(value);
    }

    setValue('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle-all"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={event => setValue(event.target.value)}
          disabled={isLoading}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
