import React, { useEffect, useRef, useState } from 'react';

interface Props {
  isDisabled: boolean;
  onAdd: (title: string) => Promise<boolean>;
  focusVersion: number;
}

export const NewTodo: React.FC<Props> = ({
  isDisabled,
  onAdd,
  focusVersion,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled, focusVersion]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    const wasAdded = await onAdd(title.trim());

    if (wasAdded) {
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
        aria-label="New todo"
        value={title}
        onChange={event => setTitle(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  );
};
