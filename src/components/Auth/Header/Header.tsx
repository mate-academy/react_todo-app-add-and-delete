import React, { FormEvent, RefObject } from 'react';

type Props = {
  newTodosField: RefObject<HTMLInputElement>,
  setTitle: React.Dispatch<React.SetStateAction<string>>,
  handleSubmit: (event: FormEvent) => Promise<void>,
  title: string,
};

export const Header: React.FC<Props> = ({
  newTodosField,
  setTitle,
  handleSubmit,
  title,
}) => {
  const getValue = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(value);
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="close"
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={handleSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodosField}
          value={title}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={getValue}
        />
      </form>
    </header>
  );
};
