type Props = {
  allCompleted: boolean;
  onToggleAll: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  title: string;
  isAdding: boolean;
  onTitleChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
  hasTodos: boolean;
};

export const Header: React.FC<Props> = ({
  allCompleted,
  onToggleAll,
  inputRef,
  title,
  isAdding,
  onTitleChange,
  onSubmit,
  hasTodos,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      {hasTodos && (
        <button
          type="button"
          className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
          onClick={onToggleAll}
          data-cy="ToggleAllButton"
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={isAdding}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
