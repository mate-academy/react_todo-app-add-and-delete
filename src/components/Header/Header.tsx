type Props = {
  addTodo: (e: React.FormEvent<HTMLFormElement>) => void;
  setInputTitle: (value: string) => void;
  inputTitle: string;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  addTodo,
  inputTitle,
  setInputTitle,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputTitle}
          onChange={e => setInputTitle(e.target.value)}
          ref={inputRef}
          autoFocus
        />
      </form>
    </header>
  );
};
