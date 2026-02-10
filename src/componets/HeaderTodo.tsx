import cn from 'classnames';

type Props = {
  allCompleted: boolean;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  title: string;
  isAdding: boolean;
  onSubmit: (event: React.FormEvent) => void;
  onTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const HeaderTodo: React.FC<Props> = ({
  allCompleted,
  inputRef,
  title,
  isAdding,
  onSubmit: handleSubmit,
  onTitleChange: handleTitleChange,
}) => {
  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={cn('todoapp__toggle-all', {
          active: allCompleted,
        })}
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          name="NewTodoField"
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isAdding}
          autoFocus
        />
      </form>
    </header>
  );
};
