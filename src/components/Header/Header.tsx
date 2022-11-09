type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  todoTitle: string;
  onChangeTodoTitle: (title: string) => void;
  submitNewTodo: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  newTodoField,
  todoTitle,
  onChangeTodoTitle: onGetTodoTitle,
  submitNewTodo,
  isAdding,
}) => (
  <header className="todoapp__header">
    <button
      data-cy="ToggleAllButton"
      type="button"
      className="todoapp__toggle-all active"
      aria-label="Toggle All"
    />

    <form onSubmit={submitNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        ref={newTodoField}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        onChange={event => onGetTodoTitle(event.target.value)}
        disabled={isAdding}
      />
    </form>
  </header>
);
