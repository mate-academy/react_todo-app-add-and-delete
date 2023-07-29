import React from 'react';
import { ErrorType } from '../types/Error';

type Props = {
  onSubmit: (title: string) => {},
  title: string,
  setTitle: (title: string) => void,
  setError: (error: ErrorType) => void,
};

export const AddForm: React.FC<Props> = ({
  onSubmit,
  title,
  setTitle,
  setError,
}) => {
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length < 1) {
      setError(ErrorType.emptyValue);

      return Promise.resolve();
    }

    if (title.trim().length > 1) {
      await onSubmit(title);
      setTitle('');
    }

    return Promise.resolve();
  };

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={handleTitleChange}
      />
    </form>
  );
};
