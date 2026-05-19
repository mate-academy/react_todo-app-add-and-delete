import classNames from 'classnames';

type Props = {
  todosLength: number;
  incompleteTodosCount: number;
  onAddTodo: React.FormEventHandler<HTMLFormElement>;
  isSending: boolean;
  newTodoInput: React.RefObject<HTMLInputElement>;
  newTodoTitle: string;
  setNewTodoTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const Header: React.FC<Props> = ({
  todosLength,
  incompleteTodosCount,
  onAddTodo,
  isSending,
  newTodoInput,
  newTodoTitle,
  setNewTodoTitle,
}) => {
  return (
    <header className="todoapp__header">
      {!!todosLength && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            incompleteTodosCount && 'active',
          )}
          data-cy="ToggleAllButton"
        />
      )}

      <form onSubmit={onAddTodo}>
        <input
          disabled={isSending}
          ref={newTodoInput}
          value={newTodoTitle}
          onChange={e => {
            setNewTodoTitle(e.target.value);
          }}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
        />
      </form>
    </header>
  );
};
