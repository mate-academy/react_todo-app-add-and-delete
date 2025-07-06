import { RefObject, SetStateAction } from 'react';

type Props = {
  query: string;
  inputRef: RefObject<HTMLInputElement | null>;
  isDisabled: boolean;
  handleSubmit: (value: React.FormEvent<HTMLFormElement>) => void;
  setQuery: React.Dispatch<SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  query,
  inputRef,
  isDisabled,
  setQuery,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={query}
          ref={inputRef}
          disabled={isDisabled}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={event => setQuery(event.target.value)}
        />
      </form>
    </header>
  );
};
