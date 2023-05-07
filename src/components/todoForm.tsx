interface Props {
  setTitle: React.Dispatch<React.SetStateAction<string | undefined>>,
  title: string | undefined,
  onAdd: () => void,
}

export const TodoForm: React.FC<Props> = ({
  setTitle, title, onAdd,
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
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form
        onSubmit={onSubmit}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={onChange}
        />
      </form>
    </header>
  );
};
