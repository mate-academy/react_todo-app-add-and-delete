/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, FormEvent, useState } from 'react';
import { TodoAdd } from '../../types/Todo';

interface Props {
  userId: number;
  onSubmit: (dataAddTodo: TodoAdd) => void;
  onError: (titleToError: string) => void;
}

export const Header: FC<Props> = ({
  userId,
  onError,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');

  const dataAddTodo = {
    title,
    userId,
    completed: false,
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (title.trim() !== '') {
      onSubmit(dataAddTodo);
      setTitle('');
    }

    onError('Title can\'t be empty');
    setTitle('');
  };

  return (
    <header className="todoapp__header">
      <button type="button" className="todoapp__toggle-all active" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={event => setTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
