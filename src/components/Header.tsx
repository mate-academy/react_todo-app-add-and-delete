type Props = {
  allComplete: boolean;
  newTodoRef: React.RefObject<HTMLInputElement>;
  newTitle: string;
  onTitleChange: (value: string) => void;
  onSubmit: () => void;
  isAdding: boolean;
};

export const Header: React.FC<Props> = ({
  allComplete,
  newTodoRef,
  newTitle,
  onTitleChange,
  onSubmit,
  isAdding,
}) => (
  <header className="todoapp__header">
    {/* this button should have `active` class only if all todos are completed */}
    <button
      type="button"
      className={`todoapp__toggle-all ${allComplete ? 'active' : ''}`}
      data-cy="ToggleAllButton"
    />

    {/* Add a todo on form submit */}
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <input
        ref={newTodoRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTitle}
        onChange={event => onTitleChange(event.target.value)}
        disabled={isAdding}
      />
    </form>
  </header>
);
