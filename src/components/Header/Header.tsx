import React, { memo } from 'react';

type Props = {
  title: string,
  isAdding: boolean,
  onChange:(query: string) => void;
  submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  newTodoField: React.RefObject<HTMLInputElement>
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    title,
    isAdding,
    onChange,
    submitForm,
    newTodoField,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */ }
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={submitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isAdding}
          value={title}
          onChange={(event) => onChange(event.target.value)}
        />
      </form>
    </header>
  );
});
