import React, { useEffect, useState } from 'react';

type Props = {
  onSubmitted: (value: string) => Promise<boolean>;
  inputRef: React.RefObject<HTMLInputElement>;
};

export const Form: React.FC<Props> = ({ onSubmitted, inputRef }) => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const response = await onSubmitted(value);

      if (response) {
        setValue('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={value}
        onChange={event => setValue(event.target.value)}
        disabled={isLoading}
      />
    </form>
  );
};
