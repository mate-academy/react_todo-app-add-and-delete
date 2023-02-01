import React, { FC, memo, RefObject } from 'react';

export interface Props {
  newTodoField: RefObject<HTMLInputElement>,
  title: string,
  onSetTitle: (value: string) => void,
  isAdding: boolean,
  onFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void,
}

export const Header: FC<Props> = memo(({
  newTodoField,
  title,
  onSetTitle: setTitle,
  isAdding,
  onFormSubmit,
}) => {
  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={onFormSubmit}>
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
});
