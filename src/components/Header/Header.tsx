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
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="Mute volume"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={(event) => handleSubmit(event)}
      >
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
