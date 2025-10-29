import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onSetError: (arg: string) => void;
  onAddTodo: (title: string) => void;
};

export const NewTodo: React.FC<Props> = ({ onSetError, onAddTodo }) => {
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isDisabled) {
      inputRef.current?.focus();
    }
  }, [isDisabled]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onSetError('Title should not be empty');

      return;
    }

    setIsDisabled(true);
    try {
      await onAddTodo(title.trim());
      setTitle('');
    } catch {
    } finally {
      setIsDisabled(false);
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
        disabled={isDisabled}
        onChange={event => setTitle(event.target.value.trimStart())}
      />
    </form>
  );
};
