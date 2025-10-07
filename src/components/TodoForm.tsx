type PropsForm = {
  focusRef: React.RefObject<HTMLInputElement>;
  handleAdd: (e: React.FormEvent<HTMLFormElement>) => void;
  isDisabled: boolean;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodoForm: React.FC<PropsForm> = ({
  focusRef,
  handleAdd,
  isDisabled,
  title,
  setTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusRef}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
