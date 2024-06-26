import cn from 'classnames';

type Props = {
  isAllActive: () => boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  isDisabledInput: boolean;
  query: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Header: React.FC<Props> = ({
  isAllActive,
  handleSubmit,
  inputRef,
  isDisabledInput,
  query,
  handleChange,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: isAllActive,
        })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabledInput}
          value={query}
          onChange={handleChange}
        />
      </form>
    </header>
  );
};
