/* eslint-disable jsx-a11y/control-has-associated-label */

type Props = {
  totalTodoListLength: number,
  query: string,
  onSetQuery: (query: string) => void,
  isDisabledForm: boolean,
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) =>
  void | Promise<void>;
};

export const Header: React.FC<Props> = ({
  totalTodoListLength,
  query,
  onSetQuery,
  isDisabledForm,
  handleSubmit,
}) => {
  const isActiveToggleButton = !!totalTodoListLength;

  return (
    <header className="todoapp__header">
      {isActiveToggleButton && (
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={(event) => handleSubmit(event)}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={query}
          onChange={(event) => {
            onSetQuery(event.target.value);
          }}
          disabled={isDisabledForm}
        />
      </form>
    </header>
  );
};
