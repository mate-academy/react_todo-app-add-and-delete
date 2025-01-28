import { FC, FormEvent, useEffect, useRef } from 'react';

interface Props {
  query: string;
  onQueryChange: (newQuery: string) => void;
  addTodo: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  loadingIds: number[];
}

export const Header: FC<Props> = ({
  query,
  onQueryChange,
  addTodo,
  isLoading,
  loadingIds,
}) => {
  const todoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoFieldRef.current) {
      todoFieldRef.current.focus();
    }
  }, [isLoading, loadingIds]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => addTodo(event)}>
        <input
          ref={todoFieldRef}
          value={query}
          onChange={e => onQueryChange(e.target.value)}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
