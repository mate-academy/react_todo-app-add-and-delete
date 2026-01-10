import React from 'react';

type Props = {
  allCompleted: boolean;
  titlename: string;
  toggleAll: () => void;
  handleTitleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  allCompleted,
  toggleAll,
  titlename,
  handleTitleChange,
  handleSubmitForm,
  isAdding,
  inputRef,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
        onClick={toggleAll}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmitForm}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={titlename}
          onChange={handleTitleChange}
          autoFocus
          disabled={isAdding}
          ref={inputRef}
        />
      </form>
    </header>
  );
};
