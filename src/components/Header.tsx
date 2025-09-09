import classNames from 'classnames';

type Props = {
  todosLength: number;
  isSomeTodoComplete: boolean;
  disableInput: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  input: string;
  handleSubmit: (event: React.FormEvent) => void;
  setInput: (value: string) => void;
};

export const Header: React.FC<Props> = ({
  todosLength,
  isSomeTodoComplete,
  input,
  disableInput,
  inputRef,
  setInput,
  handleSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {todosLength > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: isSomeTodoComplete,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={input}
          onChange={e => {
            setInput(e.target.value);
          }}
          ref={inputRef}
          disabled={disableInput}
        />
      </form>
    </header>
  );
};
