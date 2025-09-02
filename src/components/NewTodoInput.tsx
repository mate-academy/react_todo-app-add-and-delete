import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onAdd: (title: string) => void;
  disabled?: boolean;
  focusTrigger?: boolean;
};

export const NewTodoInput: React.FC<Props> = ({
  onAdd,
  disabled,
  focusTrigger,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      return;
    }

    onAdd(trimmed);
    setTitle('');
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusTrigger]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={disabled}
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        data-cy="NewTodoField"
      />
    </form>
  );
};
