import { useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (title: string) => Promise<boolean> | boolean;
  disabled: boolean;
};

export const TodoForm: React.FC<Props> = ({ onSubmit, disabled }) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const success = await onSubmit(trimmedTitle);

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
        disabled={disabled}
        value={title}
        onChange={handleInputChange}
      />
    </form>
  );
};
