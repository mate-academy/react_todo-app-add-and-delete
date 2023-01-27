type Props = {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  handleKeyDown: (event: any) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  value,
  setValue,
  handleKeyDown,
  isAdding,
}) => {
  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        aria-label="button"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          disabled={!isAdding}
          onChange={(e) => setValue(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
        />
      </form>
    </header>
  );
};
