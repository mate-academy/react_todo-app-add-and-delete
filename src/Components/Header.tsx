import { Todo } from '../types/Todo';

interface Props {
  todos: Todo[],
  onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
  title: string,
  setTitle: (t: string) => void,
  isDisabled: boolean,
}

export const Header: React.FC<Props> = ({
  todos,
  onSubmitForm,
  title,
  setTitle,
  isDisabled,
}) => {
  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
          data-cy="ToggleAllButton"
          aria-label="Toggle All"
          disabled={isDisabled}
        />
      )}
      <form
        action="/"
        method="Post"
        onSubmit={onSubmitForm}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
