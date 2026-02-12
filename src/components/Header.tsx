type Props = {
  disabled: boolean;
};

export const Header: React.FC<Props> = ({ disabled }) => (
  <header className="todoapp__header">
    <h1 className="todoapp__title">todos</h1>
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        disabled={disabled}
      />
    </form>
  </header>
);
