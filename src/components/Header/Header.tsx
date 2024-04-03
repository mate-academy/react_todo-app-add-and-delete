import './Header.scss';
type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  isDisabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};
export const Header: React.FC<Props> = ({
  handleSubmit,
  handleInputChange,
  title,
  isDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={handleInputChange}
          disabled={isDisabled}
        />
      </form>
    </header>
  );
};
