import React, { useState } from 'react';

type Props = {
  addNewTodos: (title: string) => void;
};

export const Header: React.FC<Props> = ({ addNewTodos }) => {
  const [query, setQuery] = useState('');
  const [isTitleEmpty, setIsTitleEmpty] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsTitleEmpty(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addNewTodos(query);
    setQuery('');
  };

  const checkIsTitleEmpty = () => {
    if (!query) {
      setIsTitleEmpty(true);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Toogle active"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => handleInput(event)}
          onBlur={checkIsTitleEmpty}
        />
      </form>
      {isTitleEmpty && (
        <p className="todoapp__notification-empty">
          {'Title can\'t be empty'}
        </p>
      )}
    </header>
  );
};
