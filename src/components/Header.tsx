import { FormEvent, RefObject } from 'react';

type Props = {
  newTodosField: RefObject<HTMLInputElement>,
  addNewTodo: (event: FormEvent) => Promise<void>,
  title: string,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
};

export const Header: React.FC<Props> = ({
  newTodosField,
  addNewTodo,
  title,
  setTitle,
}) => {
  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  return (
    <header className="todoapp__header">
      {newTodosField === null
      && (
        <button
          aria-label="Toggle"
          data-cy="ToggleAllButton"
          type="button"
          className="todoapp__toggle-all active"
        />
      )}

      <form onSubmit={addNewTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodosField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={getValue}
        />
      </form>
    </header>
  );
};
