import React, { useEffect, useRef, useState } from 'react';
import { ErrorMessage } from '../../types/Errors';

interface Props {
  onSubmit: (title: string) => Promise<boolean>;
  onError: (value: ErrorMessage) => void;
  disabled?: boolean;
}

export const AddForm: React.FC<Props> = ({
  onSubmit,
  onError,
  disabled = false,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (disabled) {
      return;
    }

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      onError(ErrorMessage.Title);

      return;
    }

    const isSuccess = await onSubmit(normalizedTitle);

    if (isSuccess) {
      setTitle('');
    }
  };

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onError(ErrorMessage.None);
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={changeHandler}
        disabled={disabled}
        aria-disabled={disabled}
      />
    </form>
  );
};
