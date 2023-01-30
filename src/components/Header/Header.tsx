import React, { memo } from 'react';

type Props = {
  newTodoField: React.RefObject<HTMLInputElement>;
  title: string;
  isTodoAdding: boolean;
  handleChangeInput: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
};

export const Header: React.FC<Props> = memo((props) => {
  const {
    newTodoField,
    title,
    isTodoAdding,
    handleChangeInput,
    handleSubmitForm,
  } = props;

  return (
    <header className="todoapp__header">
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={(event) => handleChangeInput(event.currentTarget.value)}
          disabled={isTodoAdding}
        />
      </form>
    </header>
  );
});
