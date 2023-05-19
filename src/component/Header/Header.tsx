/* eslint-disable jsx-a11y/control-has-associated-label */
import { FC, FormEvent, useState } from 'react';

interface Props {
  onSubmit: (todoTitle: string) => void;
  onError: (titleToError: string) => void;
}

export const Header: FC<Props> = ({
  onSubmit: handleAddTodo,
  onError,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      onError('Title can\'t be empty');
      setTitle('');

      return;
    }

    setIsDisabled(true);
    handleAddTodo(title);
    setTitle('');
    setIsDisabled(false);
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
