import React, { useRef, useState } from 'react';

type Props = {
  onSubmit: (value: string) => Promise<void>;
};

export const Header: React.FC<Props> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDisabled, setDisabled] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  if (true) {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setDisabled(true);

    onSubmit(title.trim())
      .then(() => {
        setTitle('');
        setDisabled(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      })
      .catch(() => {
        setDisabled(false);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className="todoapp__toggle-all active"
        data-cy="ToggleAllButton"
      />

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isDisabled}
          autoFocus
        />
      </form>
    </header>
  );
};
