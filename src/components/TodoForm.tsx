import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../types/enums/ErrorMessage';

type Props = {
  onAdd: (arg0: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
};

export const TodoForm: React.FC<Props> = ({ onAdd, setError }) => {
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  });

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedTitle = value.trim();

    setIsDisabled(true);

    if (normalizedTitle.length === 0) {
      setIsDisabled(false);

      return setError(ErrorMessage.emptyTitle);
    }

    return onAdd(normalizedTitle)
      .then(() => {
        setValue('');
      })
      .finally(() => {
        setIsDisabled(false);
      });
  };

  return (
    <>
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={inputRef}
          value={value}
          onChange={handleInput}
          disabled={isDisabled}
        />
      </form>
    </>
  );
};
