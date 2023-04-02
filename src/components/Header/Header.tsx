/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  title: string,
  setTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleFormSubmit: (event: React.FocusEvent<HTMLFormElement>) => void
};

export const Header: React.FC<Props> = ({
  title,
  setTitle,
  handleFormSubmit,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={setTitle}
        />
      </form>
    </header>
  );
};
