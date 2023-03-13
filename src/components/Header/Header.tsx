import { FC, useState } from 'react';

type Props = {
  onEmptyQuery: () => void;
  onSubmit: (title: string) => void;
  isDisabled: boolean;
};

export const Header: FC<Props> = ({
  onEmptyQuery,
  onSubmit,
  isDisabled,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (): void => {
    if (!query) {
      onEmptyQuery();
    }

    onSubmit(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      {/* Add a todo on form submit */}
      <form onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
