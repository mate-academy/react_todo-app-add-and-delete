import { FC } from 'react';

type Props = {
  handleSubmit: (event: React.FormEvent) => void,
  query: string,
  setQuery: (title: string) => void,
};

export const Header:FC<Props> = ({ handleSubmit, query, setQuery }) => (
  <header className="todoapp__header">
    {/* this buttons is active only if there are some active todos */}
    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
    <button type="button" className="todoapp__toggle-all active" />

    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
    </form>
  </header>
);
