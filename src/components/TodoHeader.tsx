import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ErrorsType } from '../types/Error';

interface Props {
  setErrorMessage: Dispatch<SetStateAction<ErrorsType | null>>;
  isInputDisabled: boolean;
  todosLength: number;
  onAddTodo: (value: string) => Promise<void>;
  inputRef: React.RefObject<HTMLInputElement> | null;
}

export const TodoHeader: React.FC<Props> = ({
  inputRef,
  isInputDisabled,
  onAddTodo,
  setErrorMessage,
  todosLength,
}) => {
  const [value, setValue] = useState('');

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!value.trim()) {
      setErrorMessage(ErrorsType.EmptyTitle);

      return;
    }

    try {
      await onAddTodo(value.trim());
      setValue('');
    } catch (err) {}
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [todosLength, inputRef]);

  useEffect(() => {
    if (!isInputDisabled) {
      inputRef?.current?.focus();
    }
  }, [isInputDisabled, inputRef]);

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={onSubmit}>
        <input
          ref={inputRef}
          value={value}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setValue(e.target.value)}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
