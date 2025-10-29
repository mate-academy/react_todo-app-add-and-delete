import React, { useEffect, useRef, useState } from 'react';

type Props = {
  disabled: boolean;
  onSubmit: (title: string) => Promise<boolean>;
  focusTick?: number;
};

export const NewTodo: React.FC<Props> = ({
  disabled,
  onSubmit,
  focusTick = 0,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled, focusTick]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await onSubmit(title);

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
        autoFocus
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={disabled}
      />
    </form>
  );
};
