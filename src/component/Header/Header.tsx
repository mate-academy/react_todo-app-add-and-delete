/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, FormEvent, useState } from 'react';
import { TodoData } from '../../types/Todo';

interface Props {
  userId: number;
  onSubmit: (todoData: TodoData) => void;
  onError: (titleToError: string) => void;
}

export const Header: FC<Props> = ({
  userId,
  onSubmit,
  onError,
}) => {
  const [title, setTitle] = useState('');

  let isDisabled = false;

  const todoData = {
    title,
    userId,
    completed: false,
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    isDisabled = true;

    if (title.trim() !== '') {
      onSubmit(todoData);
      setTitle('');
      isDisabled = false;
    }

    if (title.trim() === '') {
      onError('Title can\'t be empty');
      setTitle('');
      isDisabled = false;
    }
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          disabled={isDisabled}
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
