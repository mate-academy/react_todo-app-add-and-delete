/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  searchValue: string
  searchHandler: (value: string) => void
  onAdd: (event:
  React.FormEvent<HTMLFormElement>) => void,
};

export const TodoHeader: React.FC<Props> = ({
  searchValue,
  searchHandler,
  onAdd,
}) => {
  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />
      <form onSubmit={onAdd}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={searchValue}
          onChange={(event) => {
            searchHandler(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
