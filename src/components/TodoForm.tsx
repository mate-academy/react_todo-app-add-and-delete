type Props = {
  query: string;
  setQuery: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const TodoForm: React.FC<Props> = ({
  query,
  setQuery,
  onSubmit,
  disabled,
  inputRef,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={query}
        onChange={event => setQuery(event.target.value)}
        disabled={disabled}
      />
    </form>
  );
};
