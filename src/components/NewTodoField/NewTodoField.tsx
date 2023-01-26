/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef } from 'react';

type Props = {
  handleSubmitForm: (event: React.FormEvent<HTMLFormElement>) => void,
  onChange: (newValue: string) => void,
  value: string,
  isUploadError: boolean,
};

export const NewTodoField: React.FC<Props> = ({
  handleSubmitForm,
  onChange,
  value,
  isUploadError,
}) => {
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  return (
    <header className="todoapp__header">
      <button
        data-cy="ToggleAllButton"
        type="button"
        className="todoapp__toggle-all active"
      />

      <form
        onSubmit={(event) => handleSubmitForm(event)}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={value}
          onChange={event => onChange(event.target.value)}
          disabled={isUploadError}
        />
      </form>
    </header>
  );
};
