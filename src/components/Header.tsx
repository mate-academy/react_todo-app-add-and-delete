interface Props {
  newTitle: string;
  setNewTitle: (title: string) => void;
  isAdding: boolean;
  onSubmit: (event: React.FormEvent) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
}

export const Header: React.FC<Props> = ({
  newTitle,
  setNewTitle,
  isAdding,
  onSubmit,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          ref={inputRef}
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={e => setNewTitle(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
