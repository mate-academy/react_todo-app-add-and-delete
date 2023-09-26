/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  onTodoAdd: (title: string) => Promise<void>;
  isAllCopleted: boolean;
  hasTodos: boolean,
  onTodoAddError: (error: string | null) => void;
  inputDisabled: boolean;
};

export const Header: React.FC<Props> = ({
  onTodoAdd,
  isAllCopleted,
  hasTodos,
  onTodoAddError,
  inputDisabled,
}) => {
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onTodoAddError(null);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onTodoAddError('Title should not be empty');

      return;
    }

    onTodoAdd(trimmedTitle)
      .then(() => {
        setTitle('');
      });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputDisabled]);

  return (
    <header className="todoapp__header">
      {hasTodos && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllCopleted,
          })}
          data-cy="ToggleAllButton"
        />
      )}

      <form
        onSubmit={onFormSubmit}
      >
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          ref={inputRef}
          disabled={inputDisabled}
        />
      </form>
    </header>
  );
};
