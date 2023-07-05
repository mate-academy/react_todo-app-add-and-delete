import React, { useState } from 'react';
import { ErrorText } from '../../types/ErrorText';

type Props = {
  addTodo: (value: string) => void;
  setErrorMessage: (value: ErrorText | null) => void;
};

export const Header: React.FC<Props> = ({ addTodo, setErrorMessage }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const changeTitleHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorText.onInput);
      setTitle('');

      return;
    }

    try {
      setIsLoading(true);
      await addTodo(title);
      setTitle('');
    } catch {
      setErrorMessage(ErrorText.onAdd);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="todoapp__header">
      <button
        aria-label="toggle"
        type="button"
        className="todoapp__toggle-all
        active"
      />

      <form
        onSubmit={submitHandler}
      >
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={changeTitleHandler}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
