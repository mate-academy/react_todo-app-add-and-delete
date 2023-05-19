import React from 'react';

type Props = {
  uncompletedTodosLength: number;
  todoAddQuery: string;
  onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event:React.FormEvent) => void;
  disableInput: boolean;
};

export const TodosHeader:React.FC<Props> = ({
  uncompletedTodosLength,
  todoAddQuery,
  onInput,
  onSubmit,
  disableInput,
}) => {
  return (
    <header
      className="todoapp__header"
      aria-label="todos header"
    >
      {uncompletedTodosLength > 0 && (
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
          value={todoAddQuery}
          disabled={disableInput}
          onChange={event => onInput(event)}
        />
      </form>
    </header>
  );
};
