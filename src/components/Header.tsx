/* eslint-disable max-len */
import React from 'react';

export const Header: React.FC<{ handleToggle: () => Promise<void> }> = ({
  handleToggle,
}) => {
  return (
    <header className="todoapp__header">
      {/* This button should have the `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        title="Toggle all todos"
        onClick={handleToggle}
      >
        Toggle All
      </button>
    </header>
  );
};
