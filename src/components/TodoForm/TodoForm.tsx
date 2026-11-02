import React, { useEffect } from 'react';

interface Props {
  title: string;
  setTitle: (text: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const TodoForm: React.FC<Props> = ({
  title,
  setTitle,
  onSubmit,
  isLoading = false,
  inputRef,
}) => {
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, inputRef]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        ref={inputRef}
        value={title}
        disabled={isLoading}
        onChange={e => setTitle(e.target.value)}
      />
    </form>
  );
};
