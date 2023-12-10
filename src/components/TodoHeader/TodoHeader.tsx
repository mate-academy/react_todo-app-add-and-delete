/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useRef, useEffect } from 'react';
import { ErrorType } from '../../types/ErrorType';

type Props = {
  onSetTodosError: (value: ErrorType) => void,
  onSetHiddenClass: (value: boolean) => void,
  onSubmitForm: (
    value: string,
    func: (v: string) => void,
  ) => void,
};

export const TodoHeader: React.FC<Props> = ({
  onSetTodosError,
  onSetHiddenClass,
  onSubmitForm,
}) => {
  const [title, setTitle] = useState('');
  const titleField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (title.trim().length > 0) {
      onSubmitForm(title, setTitle);
    } else {
      onSetHiddenClass(false);
      onSetTodosError(ErrorType.TITLE_NOT_EMPTY);
    }
  };

  return (
    <header className="todoapp__header">
      {/* this buttons is active only if there are some active todos */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          // disabled={tempTodo !== null}
          value={title}
          onChange={event => setTitle(event.target.value)}
          ref={titleField}
        />
      </form>
    </header>
  );
};
