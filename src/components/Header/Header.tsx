import React, { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string,
  isAdding: boolean,
  changeInput: React.Dispatch<React.SetStateAction<string>>,
  submitForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    title,
    isAdding,
    changeInput,
    submitForm,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
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
          value={title}
          onChange={(event) => changeInput(event.target.value)}
          disabled={isAdding}
        />
      </form>
    </header>
  );
});
