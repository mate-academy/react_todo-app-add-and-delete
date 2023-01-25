import { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>,
  todoTitle: string,
  setTodoTitle: (title: string) => void,
  isLoading: boolean,
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
};

export const Header: React.FC<Props> = memo(({
  newTodoField,
  todoTitle,
  setTodoTitle,
  isLoading,
  onSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={(event) => setTodoTitle(event.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );
});
