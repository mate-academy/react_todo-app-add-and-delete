import React, { useEffect, useState } from 'react';

type Props = {
  onSubmit: (title: string) => Promise<boolean>;
  disabled: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({ onSubmit, disabled, inputRef }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, inputRef]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const currentTitle = title;

    if (!currentTitle.trim()) {
      await onSubmit(currentTitle);
      inputRef.current?.focus();

      return;
    }

    const success = await onSubmit(currentTitle);

    if (success) {
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={disabled}
        autoFocus
      />
    </form>
  );
};
