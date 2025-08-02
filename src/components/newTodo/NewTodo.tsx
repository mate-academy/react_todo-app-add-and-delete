import { useEffect, useRef, useState } from 'react';

type Props = {
  handleAdd: (title: string) => Promise<void>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  shouldFocus: boolean;
};

export const NewTodo: React.FC<Props> = ({
  handleAdd,
  setError,
  shouldFocus,
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const trimmedTitle = title.trim();

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!trimmedTitle) {
      setError('Title should not be empty');

      return;
    }

    handleAdd(trimmedTitle).then(reset);
  };

  useEffect(() => {
    if (shouldFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [shouldFocus]);

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={e => setTitle(e.target.value)}
        disabled={!shouldFocus}
        autoFocus
      />
    </form>
  );
};
