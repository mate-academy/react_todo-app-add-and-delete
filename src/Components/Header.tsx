/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

type Props = {
  onTodoAdd: (title: string) => Promise<void>;
  isAllCopleted: boolean;
  hasTodos: boolean,
  setErrorMessage: (error: string | null) => void;
};

export const Header: React.FC<Props> = ({
  onTodoAdd,
  isAllCopleted,
  hasTodos,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage(null);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage('Title should not be empty');
    }

    onTodoAdd(title)
      .then(() => {
        setTitle('');
      });
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
        />
      </form>
    </header>
  );
};
