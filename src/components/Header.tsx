interface Props {
  todoInput: React.RefObject<HTMLInputElement>;
  title: string;
  onTodoSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onTitleChange: (newTitle: string) => void;
  loading: boolean;
}

export const Header: React.FC<Props> = ({
  todoInput,
  title,
  onTodoSubmit,
  onTitleChange,
  loading,
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
      <form onSubmit={event => onTodoSubmit(event)}>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          disabled={loading}
          onChange={event => onTitleChange(event.target.value)}
        />
      </form>
    </header>
  );
};
