/* eslint-disable no-useless-return */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { Todo } from '../types/Todo';
import { Notification } from '../types/Notification';

type Props = {
  userId: number;
  onSubmit: (v: Todo) => Promise<void>;
  onChangeError: (v: string) => void;
};

export const TodoHeader: React.FC<Props> = ({
  userId,
  onSubmit,
  onChangeError,
}) => {
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [title, setTitle] = useState('');

  const handleChageTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onChangeError('');
  };

  const reset = () => {
    setTitle('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onChangeError(Notification.title);

      return;
    }

    setIsSubmiting(true);

    onSubmit({
      id: 0,
      title,
      completed: false,
      userId,
    })
      .then(reset)
      .finally(() => setIsSubmiting(false));
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
          data-cy="createTodo"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleChageTitle}
          disabled={isSubmiting}
        />
      </form>
    </header>
  );
};
