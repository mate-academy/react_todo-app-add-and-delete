import React, { useState } from 'react';

type Props = {
  activeTodosLength: number,
  onSubmit: (title: string) => void,
};

export const Header: React.FC<Props> = ({ activeTodosLength, onSubmit }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onSubmit(title);
    setTitle('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <header className="todoapp__header">
      {activeTodosLength !== 0 && (
        /* eslint-disable jsx-a11y/control-has-associated-label */
        <button type="button" className="todoapp__toggle-all active" />
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={title}
          onChange={handleTitleChange}
        />
      </form>
    </header>
  );
};
