import React, { FormEvent, useEffect, useState } from 'react';

type Props = {
  onAdd: (title: string) => Promise<void>;
  onEmpty: () => void;
  isAdding: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const NewTodo: React.FC<Props> = ({
  onAdd,
  onEmpty,
  isAdding,
  inputRef,
}) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [inputRef, isAdding]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      onEmpty();
      inputRef.current?.focus();

      return;
    }

    try {
      await onAdd(trimmedTitle);
      setTitle('');
    } catch {}
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
        disabled={isAdding}
      />
    </form>
  );
};
