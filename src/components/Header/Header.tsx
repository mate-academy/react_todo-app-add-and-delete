/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';

type Props = {
  query: string,
  onChangeQuery: (event: React.FormEvent<HTMLInputElement>) => void,
  addTodo: (event: React.KeyboardEvent<HTMLFormElement>) => void,
  loading: boolean,
};

export const Header: React.FC<Props> = ({
  query,
  onChangeQuery,
  addTodo,
  loading,
}) => {
  return (
    <header className="todoapp__header">

      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={addTodo}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={onChangeQuery}
          disabled={loading}
        />
      </form>
    </header>
  );
};
