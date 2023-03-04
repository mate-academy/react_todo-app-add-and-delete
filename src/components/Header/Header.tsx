type Props = {
  title: string,
  setTitle: (value: string) => void,
  onSubmit: (event: React.FormEvent) => void,
  isDisabled: boolean,
};

export const Header: React.FC<Props> = ({
  title, setTitle, onSubmit, isDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={title}
          onChange={(event) => {
            if (event.target.value !== ' ') {
              setTitle(event.target.value);
            }
          }}
        />
      </form>
    </header>
  );
};
