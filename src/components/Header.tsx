import React, { useEffect, useState } from 'react';
type Props = {
  onError: (message: string) => void;
  onAdd: (title: string) => Promise<void>;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};
export const Header: React.FC<Props> = ({
  onError,
  onAdd,
  isSubmitting,
  inputRef,
}) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSubmitting, inputRef]);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const titleLocal = title.trim();

    if (titleLocal === '') {
      return onError('Title should not be empty');
    }

    return onAdd(titleLocal)
      .then(() => setTitle(''))
      .catch(() => {});
  };

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
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={title}
          disabled={isSubmitting}
          onChange={event => {
            setTitle(event.target.value);
          }}
        />
      </form>
    </header>
  );
};
