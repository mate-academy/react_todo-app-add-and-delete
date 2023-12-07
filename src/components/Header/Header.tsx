import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onSetError: (v: string) => void,
  onSetHiddenClass: (v: boolean) => void,
  onSubmitForm: (
    v: string,
    f: (v: string) => void) => void,
  isDisabledWhileLoading: boolean,
};

export const Header: React.FC<Props> = ({
  onSetError,
  onSetHiddenClass,
  onSubmitForm,
  isDisabledWhileLoading,
}) => {
  const [title, setTitle] = useState('');
  const inputField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputField.current) {
      inputField.current.focus();
    }
  }, [isDisabledWhileLoading]);

  const submitFormHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length > 0) {
      onSubmitForm(title, setTitle);
    } else {
      onSetHiddenClass(false);
      onSetError('Title should not be empty');
      setTimeout(() => onSetHiddenClass(true), 3000);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      {/* eslint-disable jsx-a11y/control-has-associated-label  */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={submitFormHandler}>
        <input
          data-cy="NewTodoField"
          type="text"
          name="input"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          ref={inputField}
          disabled={isDisabledWhileLoading}
          onChange={(event) => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
