import { FormEvent, useState } from 'react';

type Props = {
  createTodo: (title: string) => void,
  isDisableInput: boolean,
};

export const Header: React.FC<Props> = ({
  createTodo,
  isDisableInput,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    createTodo(query);
    setQuery('');
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Mute volume"
      />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          disabled={isDisableInput}
        />
      </form>
    </header>
  );
};
