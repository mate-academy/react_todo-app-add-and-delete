import { useEffect } from 'react';

interface HeaderProps {
  inputText: string;
  setInputText: (inputText: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<HeaderProps> = ({
  inputText,
  setInputText,
  handleAddTodo,
  loading,
  inputRef,
}) => {
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [loading]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          ref={inputRef}
          disabled={!!loading} // Convert loading to boolean
        />
      </form>
    </header>
  );
};
