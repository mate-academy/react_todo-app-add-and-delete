import React from 'react';

type Props = {
  uncompletedTodosCount: number;
  todoTitle: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event:React.FormEvent) => void;
  disableInput: boolean;
};

export const TodosHeader:React.FC<Props> = ({
  uncompletedTodosCount,
  todoTitle,
  onInput,
  onSubmit,
  disableInput,
}) => (
  <header
    className="todoapp__header"
    aria-label="todos header"
  >
    {uncompletedTodosCount > 0 && (
      <button
        type="button"
        className="todoapp__toggle-all active"
        aria-label="toggle all active todos"
      />
    )}

    <form
      onSubmit={(event) => onSubmit(event)}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={todoTitle}
        disabled={disableInput}
        onChange={event => onInput(event)}
      />
    </form>
  </header>
);
