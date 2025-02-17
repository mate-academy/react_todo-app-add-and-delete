import React, { useEffect, useRef, useState } from 'react';

import { USER_ID } from '../../api';

import { Todo, ErrorType } from '../../types';

interface Props {
  setError: (e: string) => void;
  onCreate: (todo: Omit<Todo, 'id'>) => Promise<void>;
  isSubmitting: boolean;
  shouldFocusInput: boolean;
  setShouldFocusInput: (value: boolean) => void;
}

export const Header: React.FC<Props> = ({
  setError,
  onCreate,
  isSubmitting,
  shouldFocusInput,
  setShouldFocusInput,
}) => {
  const [title, setTitle] = useState('');
  const [shouldFocus, setShouldFocus] = useState(false);
  const [requestError, setRequestError] = useState(false);

  const inputElement = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (shouldFocusInput && inputElement.current) {
      inputElement.current.focus();
      setShouldFocusInput(false);
    }
  }, [shouldFocusInput]);

  useEffect(() => {
    if (shouldFocus && inputElement.current) {
      inputElement.current.focus();
      setShouldFocus(false);
    }
  }, [shouldFocus]);

  function reset() {
    setTitle('');
  }

  function onSubmitTodo(event: React.FormEvent) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length === 0) {
      setError(ErrorType.EMPTY_TITLE);
      setTimeout(() => setError(''), 3000);

      return;
    }

    setTitle(trimmedTitle);

    onCreate({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(() => {
        reset();
        setShouldFocus(true);
        setRequestError(false);
        setShouldFocusInput(true);
      })
      .catch(() => {
        setRequestError(true);
      });
  }

  useEffect(() => {
    if (requestError) {
      setShouldFocus(true);
    }
  }, [requestError]);

  useEffect(() => {
    if (shouldFocus) {
      inputElement.current?.focus();
    }
  }, [shouldFocus]);

  return (
    <header className="todoapp__header">
      <form onSubmit={onSubmitTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={e => setTitle(e.target.value)}
          ref={inputElement}
          autoFocus
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
