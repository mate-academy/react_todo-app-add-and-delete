type Props = {
  textField: string;
  onTextField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmiting: boolean;
  field: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  textField,
  onTextField,
  onSubmit,
  isSubmiting,
  field,
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
      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={field}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={textField}
          onChange={onTextField}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
