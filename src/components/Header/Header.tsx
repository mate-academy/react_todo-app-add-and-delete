import React from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string;
  isAdding: boolean;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  onSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = (props) => {
  const {
    newTodoField,
    title,
    isAdding,
    onChange,
    onSubmitForm,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={event => onSubmitForm(event)}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => onChange(event.currentTarget.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
};
