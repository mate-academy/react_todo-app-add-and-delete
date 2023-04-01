import React, { useState } from 'react';

type Props = {
  onSubmit: (title:string) => void;
  isDisabled: boolean;
  errorInput: () => void;
};

export const Header: React.FC<Props> = ({
  onSubmit,
  isDisabled,
  errorInput,
}) => {
  const [query, setQuery] = useState('');
  const handleSubmit = () => {
    if (!query) {
      errorInput();

      return;
    }

    onSubmit(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toogle-all"
        type="button"
        className="todoapp__toggle-all
        active"
      />

      <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
