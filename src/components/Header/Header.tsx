import classNames from 'classnames';

type Props = {
  textField: string;
  onTextField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmiting: boolean;
  field: React.RefObject<HTMLInputElement>;
  onToggleAll: () => void;
  isToggleActive: boolean;
  isToggleVisible: boolean;
};

export const Header: React.FC<Props> = ({
  textField,
  onTextField,
  onSubmit,
  isSubmiting,
  field,
  onToggleAll,
  isToggleActive,
  isToggleVisible,
}) => {
  return (
    <header className="todoapp__header">
      {isToggleVisible && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isToggleActive,
          })}
          data-cy="ToggleAllButton"
          onClick={onToggleAll}
        />
      )}

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
