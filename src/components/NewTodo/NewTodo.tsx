import React, { useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (newTitle: string, completed?: boolean) => Promise<void>;
  disabled: boolean;
  onErrorInput: () => void;
};

export const NewTodo: React.FC<Props> = ({
  onSubmit,
  disabled,
  onErrorInput,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const reset = () => {
    setTitle('');
  };

  const handleChange = (changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = changeEvent.target.value;

    setTitle(inputValue);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTitle = title.trim();

    if (newTitle) {
      onSubmit(newTitle)
        .then(reset)
        .catch(() => setTitle(title));
    } else {
      onErrorInput();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        disabled={disabled}
        value={title}
        onChange={handleChange}
      />
    </form>
  );
};
