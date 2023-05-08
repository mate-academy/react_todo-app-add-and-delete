interface Props {
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>,
  title: string | undefined,
  onAdd: () => void,
  disableForm: boolean,
}

export const TodoForm: React.FC<Props> = ({
  setTitle, title, onAdd, disableForm,
}) => {
  const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    onAdd();
  };

  const onChange = (
    ev: React.ChangeEvent<HTMLInputElement>,
  ) => setTitle(ev.currentTarget.value);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle-all"
      />

      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onChange}
          disabled={disableForm}
        />
      </form>
    </header>
  );
};
