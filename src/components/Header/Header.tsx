/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  input: string;
  submitHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  onChangeHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  input,
  submitHandler,
  onChangeHandler,
}) => {
  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form
        onSubmit={submitHandler}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={onChangeHandler}
        />
      </form>
    </header>
  );
};
