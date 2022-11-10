/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todosAreLoaded: boolean;
  addNewTodo: (event: React.FormEvent) => void;
  newTodoField: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  todosAreLoaded,
  addNewTodo,
  newTodoField,
  newTodoTitle,
  handleTitleChange,
  isAdding,
}) => (
  <header className="todoapp__header">
    {todosAreLoaded && (
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />
    )}

    <form onSubmit={addNewTodo}>
      <input
        data-cy="NewTodoField"
        type="text"
        value={newTodoTitle}
        ref={newTodoField}
        disabled={isAdding}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        onChange={handleTitleChange}
      />
    </form>
  </header>
);
