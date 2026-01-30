import React, { useEffect, useState } from 'react';
import { ERRORS } from '../utils/errors';
interface Props {
  onAdd: (title: string) => Promise<boolean>;
  isSubmitting: boolean;
  onError?: (message: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}
export const Header: React.FC<Props> = ({
  onAdd,
  isSubmitting,
  onError,
  inputRef,
}) => {
  const [currentTitle, setCurrentTitle] = useState('');

  useEffect(() => {
    inputRef.current?.focus();
  }, [isSubmitting, inputRef]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = currentTitle.trim();

    if (!trimmedTitle) {
      onError?.(ERRORS.title);

      return;
    }

    if (isSubmitting) {
      return;
    }

    const isSuccess = await onAdd(trimmedTitle);

    if (isSuccess) {
      setCurrentTitle('');
    }
  };

  return (
    <header className="todoapp__header">
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
          value={currentTitle}
          onChange={e => setCurrentTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
