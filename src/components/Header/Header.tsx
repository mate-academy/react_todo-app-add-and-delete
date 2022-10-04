import { RefObject } from 'react';

type Props = {
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  isAdding: boolean,
  setTitle: (todoText: string) => void,
};

export const Header: React.FC<Props> = ({
  handleSubmit,
  newTodoField,
  title,
  isAdding,
  setTitle,
}) => {
  return (
    <header className="todoapp__header">
      <button
        aria-label="make all todos active or vice versa"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
