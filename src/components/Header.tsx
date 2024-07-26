interface HeaderProps {
  inputText: string;
  setInputText: (inputText: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  inputText,
  setInputText,
  handleAddTodo,
  loading,
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
      <form onSubmit={handleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputText}
          onChange={event => setInputText(event.target.value)}
          autoFocus
          disabled={loading}
        />
      </form>
    </header>
  );
};
