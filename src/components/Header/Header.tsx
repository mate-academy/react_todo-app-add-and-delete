type Props = {
  isInputDisabled: boolean;
  inputValue: string;
  setTodoTitle: (any: string) => void;
  handleAddTodo: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = ({
  isInputDisabled,
  inputValue,
  setTodoTitle,
  handleAddTodo,
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
          value={inputValue}
          onChange={event => setTodoTitle(event.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
