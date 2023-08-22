/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { ErrorMessages } from '../types/ErrorMessages';
import { Todo } from '../types/Todo';

type Props = {
  userId: number;
  setErrorMessage: (error: ErrorMessages) => void;
  onSubmit: ({ title, completed, userId }: Todo)=> void;
};

export const Header: React.FC<Props> = ({
  userId, setErrorMessage, onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [isCreat, setIsCreat] = useState(false);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage(ErrorMessages.EMPTY);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorMessages.TITLE);

      return;
    }

    setIsCreat(true);
    onSubmit({
      id: 0,
      title,
      completed: false,
      userId,
    });
    setTitle('');
    setIsCreat(false);
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form
        method="POST"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
          disabled={isCreat}
        />
      </form>
    </header>
  );
};
