import React from 'react';
import { ErrorMessage } from '../App';

type Props = {
  title: string;
  setTitle: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  error: ErrorMessage;
  setError: React.Dispatch<React.SetStateAction<ErrorMessage>>;
};

export const NewTodoForm: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  disabled,
  inputRef,
  error,
  setError,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => {
          setTitle(e.target.value);
          if (error !== ErrorMessage.None) {
            setError(ErrorMessage.None);
          }
        }}
        disabled={disabled}
      />
    </form>
  );
};
