interface Props {
  onTodoSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const Header: React.FC<Props> = ({
  onTodoSubmit,
  newTodoTitle,
  setNewTodoTitle,
  inputRef,
  isDisabled,
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
      <form onSubmit={onTodoSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          value={newTodoTitle}
          disabled={isDisabled}
          onChange={e => {
            setNewTodoTitle(e.target.value);
          }}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
        />
      </form>
    </header>
  );
};
