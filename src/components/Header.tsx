import { useEffect, useRef } from 'react';

type Props = {
  isDisabled: boolean,
  handleSubmit: (e: React.FormEvent) => void,
  query: string,
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
};

export const Header: React.FC<Props> = ({
  isDisabled,
  handleSubmit,
  query,
  handleInputChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current && !isDisabled) {
      inputRef.current.focus();
    }
  }, [inputRef, isDisabled]);

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
        aria-label="toggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={handleInputChange}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
