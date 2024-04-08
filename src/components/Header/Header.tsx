import React from 'react';
import { useTodos } from '../Store/Store';

const Header: React.FC = () => {
  const { handleSubmit, inputRef, query, handleChangeQuery } = useTodos();

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={handleChangeQuery}
          ref={inputRef}
        />
      </form>
    </header>
  );
};

export default Header;
