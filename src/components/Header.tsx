import { useEffect, useRef } from 'react';

interface Props {
  titleInput: string;
  setTitleInput: (title: string) => void;
  createTodoService: (title: string) => void;
  isLoading: boolean;
}

export const Header: React.FC<Props> = ({
  titleInput,
  setTitleInput,
  createTodoService,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form
        onSubmit={event => {
          event.preventDefault();
          createTodoService(titleInput);
        }}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titleInput}
          onChange={e => setTitleInput(e.target.value)}
          autoFocus
          disabled={isLoading}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
