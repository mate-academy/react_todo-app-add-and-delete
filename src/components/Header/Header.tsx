type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  onAddTodo: () => void,
  onSetNewTitle: (title: string) => void,
  newTitle: string,
};

export const Header: React.FC<Props> = ({
  newTodoField,
  onAddTodo,
  onSetNewTitle,
  newTitle,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={onAddTodo}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(event) => onSetNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
