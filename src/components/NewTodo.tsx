import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onError: (message: string) => void;
  onAdd: (title: string) => Promise<boolean>;
  isAdding: boolean;
  focusTrigger: number;
};

export const NewTodo: React.FC<Props> = ({
  onError,
  onAdd,
  isAdding,
  focusTrigger,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding, focusTrigger]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onError('Title should not be empty');

      return;
    }

    const isAdded = await onAdd(trimmedTitle);

    if (isAdded) {
      setTitle('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        disabled={isAdding}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />
    </form>
  );
};
