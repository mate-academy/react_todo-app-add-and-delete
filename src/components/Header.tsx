type Props = {
  allTodosCompleted: boolean;
  inputValue: string;
  isAdding: boolean;
  todosLength: number;
  onToggleAll: () => void;
  onInputChange: (value: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  newTodoInputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  allTodosCompleted,
  inputValue,
  isAdding,
  todosLength,
  onToggleAll,
  onInputChange,
  onSubmit,
  newTodoInputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {todosLength > 0 && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allTodosCompleted ? 'active' : ''}`}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={newTodoInputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={e => onInputChange(e.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
