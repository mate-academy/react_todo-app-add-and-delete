import cn from 'classnames';

type Props = {
  activeTodos: number;
  handleSubmit: (event: React.FormEvent) => void;
  isInputDisabled: boolean;
  newTodoTitle: string;
  handleNewTodoTitleChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  activeTodos,
  handleSubmit,
  newTodoTitle,
  handleNewTodoTitleChange,
  isInputDisabled,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: !activeTodos,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={handleNewTodoTitleChange}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
