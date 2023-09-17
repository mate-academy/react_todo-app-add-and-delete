type Props = {
  newTitle: string,
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
};

export const NewTodo: React.FC<Props> = ({
  newTitle,
  onTitleChange,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="NewTodo"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={onTitleChange}
        />
      </form>
    </header>
  );
};
