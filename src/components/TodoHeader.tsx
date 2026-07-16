import React from 'react';

type Props = {
  inputRef: React.RefObject<HTMLInputElement>;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
};

export const TodoHeader: React.FC<Props> = ({
  inputRef,
  inputValue,
  setInputValue,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
