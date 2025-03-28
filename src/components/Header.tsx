type Props = {
  newTodoTitle: string;
  setNewTodoTitle: (value: string) => void;
  createTodo: (value: string) => void;
  isLoading: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoTitle,
  setNewTodoTitle,
  createTodo,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  inputRef.current?.focus();

  useEffect(() => {
    inputRef.current?.focus();
  }, [createTodo]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      inputRef.current?.focus();
    }

    createTodo(newTodoTitle);
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={event => {
            setNewTodoTitle(event.target.value);
          }}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
